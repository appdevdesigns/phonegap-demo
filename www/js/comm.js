'use strict';

import $ from 'jquery';

import HTTPRequest from './models/httpRequest';

const Comm = {
  request({ url, method = 'GET', params }) {
    // Pull the server URL from the configuration
    const serverURL = window.localStorage.getItem('serverURL');

    // Parse the URL to extract only the protocol, host
    const parser = document.createElement('a');
    parser.href = serverURL;
    const server = `${parser.protocol}//${parser.host}`;

    const ajaxOptions = {
      url: `${server}/${url}`,
      method,
      data: params,
    };

    // Convert the "thenable" returned by jQuery's ajax method to a normal Promise instance
    return Promise.resolve($.ajax(ajaxOptions).catch(err => {
      const queuedRequest = new HTTPRequest({
        options: ajaxOptions,
      });
      queuedRequest.save();
    }));
  },
};

export default Comm;
