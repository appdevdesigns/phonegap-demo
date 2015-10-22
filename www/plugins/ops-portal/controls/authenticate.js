'use strict';

import Page from 'core/controls/page';
import Navigator from 'core/navigator';
import Authentication from 'core/authentication';
import Config from 'core/config';

var serverURL = 'http://173.16.6.59:1337'
export default Page.extend('AuthenticateControl', {
  pageId: 'login',
  template: 'plugins/ops-portal/templates/authenticate.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);

    this.scope.attr('validating', can.compute(() => {
        return this.scope.attr('status')==='validating';
      }
    ));
    this.scope.attr('pass', can.compute(() => {
        return this.scope.attr('status')==='pass';
      }
    ));
    this.scope.attr('fail', can.compute(() => {
        return this.scope.attr('status')==='fail';
      }
    ));
    
    this.render();
  },
  
  validateLogin:function () {
    this.scope.attr('status', 'validating');
    var userID = this.scope.attr('username');
    var password = this.scope.attr('password');
    console.log('userID:'+userID);
    console.log('pwd:'+password);

    if ( userID && password) {
      Authentication.login( userID, password)
      .fail((err, textStatus, errorThrown) =>{
        console.log(err);
        // if status not found or failed login
        this.scope.attr('status', 'fail');
      })
      .then((data) => {

        // Do something with data
        this.scope.attr('status', 'pass');
        setTimeout(function() { Navigator.openPage('landing') }, 2000);

      });

    }
      //});

  },
  
  'form submit'(){
      this.validateLogin();
      //Prevent default submit behavior
      return false;
  },  
  '.back click'() {
      if (Config.getServer()) {
          Navigator.openPage('landing');
      } else {
          Navigator.openPage('server');
      }
  }
});