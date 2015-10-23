'use strict';

import $ from 'jquery';
import can from 'can';

let config = {};

const attrs = can.Map();

const Config = {
  loadConfig(serverURL) {
    return $.ajax(`${serverURL}/mobile/policy`).then(res => {
      config = res;
      this.setServer(serverURL);
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