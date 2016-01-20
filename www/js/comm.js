'use strict';

import $ from 'jquery';

import Config from './config';
import HTTPRequest from './models/httpRequest';
import Navigator from './navigator';
import Authentication from './authentication';

var pendingAuthentication = [];
var authInProgress = false;

const Server = {

}

/**
 * CSRF object for internal use only.
 */
const CSRF = {
    token: null,
    /**
     * Fetch the user's CSRF token from sails.js
     * @return Deferred
     *    Resolves with the CSRF token string when it has been fetched
     */
    fetch: function() {
        var dfd = $.Deferred();
        Config.whenServerValidated.then(() => {
            $.ajax({
                type: 'GET',
                url: `${Config.getServer()}/csrfToken`,
                dataType: 'json',
                cache: false
            })
            .done((data, status, res) => {
                CSRF.token = data._csrf;
                dfd.resolve(CSRF.token);
            })
            .fail((res, status, err) => {
                var csrfError = new Error('Unable to get CSRF token: ' + err.message);
                console.log(csrfError);
                dfd.reject(csrfError);
            });
        });
        return dfd;
    }
}



const Comm = {

    server:null,


  // The "retryFailures" parameter specifies whether the request should be retried if it fails
  
  /*
   * @param object options
   * @param Deferred dfd
   *    Optional. By default a new Deferred will be created.
   * @return jQuery Deferred
   */
  request(options, dfd) {
    dfd = dfd || $.Deferred();
    
    // For compatibility with Promise
    dfd.catch = dfd.fail;
    
    Config.whenServerValidated.then(() => {
        
        const { url, method, params, retryFailures } = options;
        const ajaxOptions = {
          url: `${Config.getServer()}/${url}`,
          method,
          data: params,
        };
    
    
        // Fetch CSRF token if needed
        if (!CSRF.token && (!method || method !== 'GET')) {
            CSRF.fetch()
            .fail(dfd.reject)
            .done(() => {
                // Resubmit request after getting token
                Comm.request(options, dfd);
            });
            //return Promise.resolve(dfd).catch(function(err){});
            return dfd;
        }
    
        // add the CSRF token
        ajaxOptions.headers = { 
          'X-CSRF-Token': CSRF.token
        };
    
    
        //Check to see if we are already authenticating, and queue requests
        if (authInProgress) {
            pendingAuthentication.push({
                options: options,
                dfd: dfd
            });
        }
        else {
            // now send the request:
            $.ajax(ajaxOptions)
            .fail((res, status, statusText) => {
                if (0 && retryFailures) {
                  options.retryFailures = false;
                  const queuedRequest = new HTTPRequest({
                    options: options,
                  });
                  queuedRequest.save();
                  return;
                }
        
                // was this a CSRF error?
                else if (res.responseText.toLowerCase().indexOf('csrf') != -1) {
                    // reset our CSRF token
                    CSRF.token = null;
                    // resubmit the request 
                    Comm.request(options, dfd);
                    return;
                }
                // Need to reauthenticate?
                else if (res.status == 401) {
                    pendingAuthentication.push({
                        options: options,
                        dfd: dfd,
                    });
                    if (!authInProgress) {
                        authInProgress = true;
                        Navigator.push();
                        Navigator.openPage('login');
                    }
                    return;
                }
                else {
                    // check to see if responseText is our json response
                    var data = null;
                    try { data = JSON.parse(res.responseText); } 
                    catch(e) { data = { message: res.responseText }; }
                    dfd.reject(data);
                }
            })
            .done((data, textStatus, req) => {
        
                // Got a JSON response but was the service response an error?
                if (data.status && (data.status == 'error')) {
                    console.log('***** appdev error received!', data);
                    dfd.reject(data);
                    return;
                }
                // Success!
                else {
                    // if this was an appdev packet, only return the data:
                    if (data.status && data.status == 'success') {
                        data = data.data;
                    }
                    dfd.resolve(data);
                }
        
            })
        }
    });
    
    //return Promise.resolve(dfd);
    return dfd;
  },
};

Authentication.on('loggedIn', () => {
  authInProgress = false;
  // Resubmit all queued requests, to be resolved with their original Deferred
  pendingAuthentication.forEach(request => { 
    Comm.request(request.options, request.dfd);
  });
  
  pendingAuthentication = [];
});
export default Comm;
