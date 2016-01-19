'use strict';

import $ from 'jquery';
import can from 'can';
import Page from 'core/controls/page';
import Navigator from 'core/navigator';
import Config from 'core/config';

const defaultServer = 'http://localhost:1337';

export default Page.extend('ServerControl', {
  pageId: 'server',
  template: 'plugins/ops-portal/templates/server.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super.apply(this, arguments);

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
      this.scope.attr('serverErr', false);

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
  
  checkServer() {
    var currentServer = Config.getServer();
    if (currentServer) {
      Config.loadConfig(currentServer).then(() => {
        //Success, no need to warn anyone
        //console.log('Server good');
        this.scope.attr('serverErr', false);
      })
      .fail(err => {
        //Failed, warn the user
        //console.log('Could not connect to '+currentServer+'. Check the IP and your VPN.');
        this.scope.attr('serverErr', true);
        //alert('Warning: Unable to connect to the server. Is your VPN on?');
      })
    }
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
