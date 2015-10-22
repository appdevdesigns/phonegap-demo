'use strict';
import can from 'can';
import $ from 'jquery';
import 'can/event';
import Config from './config';

const Authentication = {
  login: function (username, password) {
    var serverURL = Config.getServer();
//  $.ajax({url:serverURL+'/csrfToken'})
//    .then((data) => {
//      var csrf = data._csrf;
      return $.ajax({
       url:serverURL+'/mobile/policy' //'/site/login', 
//      method: 'GET', 
//      data: {
//       _csrf: csrf,
//       username: this.scope.attr('username'), 
//       password: this.scope.attr('password')
//     }
    })
    .then((value) => {
      this.dispatch('loggedIn');
      return value;
    })
  }
}

can.extend(Authentication, can.event);
export default Authentication;