'use strict';

import $ from 'jquery';
import can from 'can';
import Page from 'core/controls/page';
import Navigator from 'core/navigator';
import Config from 'core/config';
import Comm from 'core/comm';

const defaultServer = 'http://173.16.6.60:1337';

export default Page.extend('ServerControl', {
  pageId: 'server',
  template: 'plugins/ops-portal/templates/server.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);

    this.scope.attr('mustConnect', !Config.getServer());
    
    // Initialize the control scope and render it
    this.scope.attr('server', Config.getServer() || defaultServer);
    ['validating', 'good', 'noResponse', 'badResponse'].forEach(state => {
      this.scope.attr(state, can.compute(() => this.scope.attr('status') === state));
    });

    this.render();
  },

  validateServer() {
    this.scope.attr('status', 'validating');
    const serverURL = this.scope.attr('server');
    Config.loadConfig(serverURL).then(() => {
      // The configuration loaded sucessfully
      this.scope.attr('status', 'good');

      // reset the Comm obj so it recalculates the server url
      Comm.server = null;  

      setTimeout(() => {
        this.scope.attr('mustConnect', false);
        Navigator.openPage('landing');
      }, 2000);
    }).fail(err => {
      console.log(err);

      // A status code of 0 means "not found"
      if (err.status === 0) {
        this.scope.attr('status', 'noResponse');
      } else if (err.status >= 400 && err.status < 500) {
        this.scope.attr('status', 'badResponse');
      }
    });
  },

  'form submit'() {
    this.validateServer();

    // Prevent default submit behavior
    return false;
  },

  '.back click'() {
    Navigator.openPage('landing');
  },
});
