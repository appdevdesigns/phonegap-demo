'use strict';

import $ from 'jquery';
import can from 'can';

let config = {
    auth: {
        type: 'local'
    }
};

const attrs = can.Map();

const Config = {
  whenServerValidated: $.Deferred(),
  
  loadConfig(serverURL) {
    // Parse the URL to extract only the protocol and host
    const parser = document.createElement('a');
    parser.href = serverURL;
    const server = `${parser.protocol}//${parser.host}`;

    return $.ajax(`${server}/mobile/policy`).then(res => {
      config = res;
      this.setServer(server);
      this.whenServerValidated.resolve();
    });
  },

  getConfig() {
    return config;
  },

  getServer() {
    return attrs.attr('serverURL');
  },

  setServer(serverURL) {
    attrs.attr('serverURL', serverURL);
    window.localStorage.setItem('serverURL', serverURL);
    this.dispatch('serverChanged', [serverURL]);
  },
};
can.extend(Config, can.event);

// Initialize the server URL with the persisted value stored in local storage
Config.setServer(window.localStorage.getItem('serverURL'));

export default Config;