/* global System */

'use strict';

// Load jQuery and configure and load jQuery Mobile
import $ from 'jquery';
import './jquery-mobile-config';

// Load CanJS and globally used plugins
import can from 'can';
import 'can/construct/proxy';
import 'can/construct/super';
import 'can/map/backup';

import Controls from './controls';
import Models from './models';
import TransactionMonitor from './transaction-monitor';
import { register as registerPlugin } from './plugins';

let Plugins = null;

// Load the configuration file
import config from 'config.json';

const app = {
  // Initialize the applications
  initialize() {
    // Bind to startup events
    document.addEventListener('deviceready', () => { this.onDeviceReady(); }, false);
  },

  // Load all plugins
  loadPlugins() {
    return Promise.all(config.plugins.map(pluginName => {
      console.log(`Loading plugin ${pluginName}`);
      return System.import(`./plugins/${pluginName}/main`).then(module => {
        const plugin = module.default;

        // Register the plugin with the system
        registerPlugin(pluginName, plugin);

        return plugin;
      });
    })).then(function(plugins) {
      Plugins = plugins;
      return plugins;
    });
  },

  // Install the application
  install() {
    // Install all models
    return Promise.all(can.map(Models, (Model, name) => Model.install()));
  },

  // Load all models
  loadModels() {
    return Promise.all(can.map(Models, (Model, name) => {
      const dfd = Model.findAll({});
      
      Model.list = new Model.List(dfd);
      Model.bind('created', (event, model) => Model.list.push(model));
      
      // HACK: CanJS does not automatically remove destroyed models from the
      // list without this hack
      Model.list.bind('remove', () => {});
      
      return dfd;
    }));
  },

  // Activate all registered plugins by calling their initialize hooks
  activatePlugins() {
    can.each(Plugins, plugin => {
      if (can.isFunction(plugin.initialize)) {
        return plugin.initialize();
      }
    });
  },

  // Create control instances for all of the control placeholders on the page
  initializeControls() {
    // Turn all placeholder elements with a "data-control" attribute that matches a control id
    // into an instance of that control type
    can.each(Controls, Control => {
      const control = new Control(`[data-control=${Control.controlId}]`, {}); // jshint ignore:line
    });
  },

  // "deviceready" event handler
  onDeviceReady() {
    console.log('Device is ready');
    app.loadPlugins().then(() => {
      console.log('Plugins loaded');
      return app.install();
    }).then(() => {
      console.log('Models installed');
      
      app.loadModels()
        .then(() => {
          console.log('Models loaded');
        });
      
      this.initializeControls();
      console.log('Controls initialized');

      // Initialize the jQuery Mobile widgets
      $.mobile.initializePage();
      console.log('Page initialized');

      // Initialize the transaction monitor
      const monitoredModels = [];
      can.each(Models, Model => {
        if (Model.monitorTransactions) {
          monitoredModels.push(Model.fullName);
        }
      });
      app.transactionMonitor = new TransactionMonitor({ monitoredModels });
      console.log('Transaction monitor initialized');
      
      this.activatePlugins();
      console.log('Plugins activated');
      
      console.log('Finished initialization');
    });
  },
};

export default app;
