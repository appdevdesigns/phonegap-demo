'use strict';
import can from 'can';
import $ from 'jquery';
import 'can/event';
import Config from './config';

const Authentication = {
    login: function (username, password) {
        var serverURL = Config.getServer();


        return $.ajax({url:serverURL+'/csrfToken'})
            .then((data) => {
                var csrf = data._csrf;
                return $.ajax({
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
                        return value;
                    })
                    .fail((err) => {
                        console.log('Yikes!', err);
                    });
            });
    }
}

can.extend(Authentication, can.event);
export default Authentication;