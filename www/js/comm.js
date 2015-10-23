'use strict';

import $ from 'jquery';

import Config from './config';
import HTTPRequest from './models/httpRequest';
import Navigator from './navigator';
import Authentication from './authentication';

var pendingAuthentication = [];


const Server = {

}

/**
 * CSRF object for internal use only.
 */
const CSRF = {
    token: 'null',
    /**
     * Fetch the user's CSRF token from sails.js
     * @return Deferred
     *    Resolves with the CSRF token string when it has been fetched
     */
    fetch: function() {
        var dfd = $.Deferred();
        $.ajax({
            type: 'GET',
            url: `${Config.getServer()}/csrfToken`,
            dataType: 'json',
            cache: false
        })
        .done(function(data, status, res){
            CSRF.token = data._csrf;
            dfd.resolve(CSRF.token);
        })
        .fail(function(res, status, err){
            var csrfError = new Error('Unable to get CSRF token: ' + err.message);
            console.log(csrfError);
            dfd.reject(csrfError);
            //dfd.resolve(null);
        });
        return dfd;
    }
}



const Comm = {

    server:null,


  // The "retryFailures" parameter specifies whether the request should be retried if it fails
  request(options) {
    var dfd = $.Deferred();

    const { url, method, params, retryFailures } = options;

    const ajaxOptions = {
      url: `${Config.getServer()}/${url}`,
      method,
      data: params,
    };


    // Fetch CSRF token if needed
    if (!CSRF.token && (!method || method !== 'GET')) {
        CSRF.fetch()
        .done(function(){
            // Resubmit request after getting token
            Comm.request(options)
            .then(dfd.resolve)
            .catch(dfd.reject);
        })
        .fail(dfd.reject);
        return Promise.resolve(dfd).catch(function(err){});
    }

    // add the CSRF token
    ajaxOptions.headers = { 
      'X-CSRF-Token': CSRF.token
    };


    //// TODO: Check to see if we are already Authenticating, and Queue requests
    

    // now send the request:
    $.ajax(ajaxOptions)
    .fail(function(req, status, statusText){
        if (retryFailures) {
          options.retryFailures = false;
          const queuedRequest = new HTTPRequest({
            options: options,
          });
          queuedRequest.save();
          return;
        }

        // was this a CSRF error?
        if (req.responseText.toLowerCase().indexOf('csrf') != -1) {

            // reset our CSRF token
            CSRF.token = null;

            // resubmit the request 
            Comm.request(options)
            .then(dfd.resolve)
            .catch(dfd.reject);
            return;
        }


        // check to see if responseText is our json response
        var data = null;
        try { data = JSON.parse(req.responseText); } catch(e) {}
        // if (('object' == typeof data) && (data != null)) {

        //     if ('undefined' != typeof data.status) {

        //         // this could very well be one of our messages:
        //         _handleAppdevError( data );
        //         return;
        //     };
        // }
        
        dfd.reject()
        

    })
    .done(function(data, textStatus, req){

        // Got a JSON response but was the service response an error?
        if (data.status && (data.status == 'error')) {

console.log('***** appdev error received!', data);

            // _handleAppdevError(data);
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



    return Promise.resolve(dfd);


    // // Convert the "thenable" returned by jQuery's ajax method to a normal Promise instance
    // return Promise.resolve($.ajax(ajaxOptions)).catch(err => {
    //   // Send to login page in case of 401
    //   if (err.status === 401 || err.status === 403) {
    //     Navigator.openPage('login');
    //     pendingAuthentication.push(options);
    //   } else if (retryFailures) {
    //     const queuedRequest = new HTTPRequest({
    //       options: ajaxOptions,
    //     });
    //     queuedRequest.save();
    //   }
    // });
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
