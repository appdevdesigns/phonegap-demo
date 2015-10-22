'use strict';

import $ from 'jquery';

import HTTPRequest from './models/httpRequest';
import Navigator from './navigator';
import Authentication from './authentication';

var pendingAuthentication = [];

const Comm = {
  // The "retryFailures" parameter specifies whether the request should be retried if it fails
  request(options) {
    const { url, method, params, retryFailures } = options;
    
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
    return Promise.resolve($.ajax(ajaxOptions)).catch(err => {
      // Send to login page in case of 401
      if (err.status === 401 || err.status === 403) {
        Navigator.openPage('login');
        pendingAuthentication.push(options);
      } else if (retryFailures) {
        const queuedRequest = new HTTPRequest({
          options: ajaxOptions,
        });
        queuedRequest.save();
      }
    });
  },
};

Authentication.on('loggedIn', () => { 
  pendingAuthentication.forEach(request => { 
    Comm.request(request);
    /*
    Promise.resolve($.ajax(request)).catch(err => {
    // Send to login page in case of 401
      if (retryFailures) {
        const queuedRequest = new HTTPRequest({
          options: request,
        });
        queuedRequest.save();
      }
    });
    */
  });
  
  pendingAuthentication = [];
});
export default Comm;
