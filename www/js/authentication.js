'use strict';
import can from 'can';
import $ from 'jquery';
import 'can/event';
import Config from './config';

const Authentication = {
    login: function (username, password) {
        var self = this;
        var serverURL = Config.getServer();
        var authType = 'CAS';
        
        var dfd = $.Deferred();
        
        $.ajax({url:serverURL+'/csrfToken'})
        .then((data) => {
            var csrf = data._csrf;
            
            // RESTful CAS interface
            if (authType == 'CAS') {
                // Step 1: Get the TGT
                $.ajax({
                    url: serverURL+'/cas/v1/tickets',
                    method: 'POST',
                    data: {
                        _csrf: csrf,
                        username: username,
                        password: password
                    }
                })
                .fail((err) => {
                    console.log('Login failed', err);
                    dfd.reject(err);
                })
                .done((data, textStatus, res) => {
                    // Step 2: Use the TGT to get a ticket
                    var tgtURL = res.getResponseHeader('Location');
                    var serviceURL = serverURL + '/site/login-done';
                    $.ajax({
                        url: tgtURL,
                        method: 'POST',
                        data: {
                            _csrf: csrf,
                            service: serviceURL
                        }
                    })
                    .fail((err) => {
                        console.log('Failed to get CAS ticket', err);
                        dfd.reject(err);
                    })
                    .done((ticket) => {
                        // Step 3: Use the ticket to get the session cookie
                        $.ajax({
                            url: serviceURL,
                            method: 'GET',
                            data: { ticket: ticket }
                        })
                        .fail((err) => {
                            console.log('Failed to validate CAS ticket', err);
                            dfd.reject(err);
                        })
                        .done(() => {
                            self.dispatch('loggedIn');
                            dfd.resolve();
                        });
                    });
                });
            }
            
            // Local auth
            else {
                $.ajax({
                    url:serverURL+'/site/login', 
                    method: 'POST', 
                    data: {
                      _csrf: csrf,
                      username: username, 
                      password: password
                    }
                })
                .then((value) => {
                    this.dispatch('loggedIn');
                    dfd.resolve();
                    return value;
                })
                .fail((err) => {
                    console.log('Yikes!', err);
                    dfd.reject(err);
                });
            }
        });
        
        return dfd;
    }
}

can.extend(Authentication, can.event);
export default Authentication;