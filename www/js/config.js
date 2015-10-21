'use strict';

import $ from 'jquery';

let config = {};

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
    return window.localStorage.getItem('serverURL');
  },

  setServer(serverURL) {
    return window.localStorage.setItem('serverURL', serverURL);
  },
};

export default Config;
