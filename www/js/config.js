'use strict';

import $ from 'jquery';

let config = {};

const Config = {
  loadConfig(serverURL) {
    // Parse the URL to extract only the protocol and host
    const parser = document.createElement('a');
    parser.href = serverURL;
    const server = `${parser.protocol}//${parser.host}`;

    return $.ajax(`${server}/mobile/policy`).then(res => {
      config = res;
      this.setServer(server);
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
