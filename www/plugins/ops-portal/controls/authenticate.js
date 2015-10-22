'use strict';

import Page from 'core/controls/page';
import Navigator from 'core/navigator';
import Authentication from 'core/authentication';

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
      Authentication.login(
        this.scope.attr('username'), 
        this.scope.attr('password'))
      .fail((err, textStatus, errorThrown) =>{
        console.log(err);
        // if status not found or failed login
        this.scope.attr('status', 'fail');
      })
      .then((data) => {
        // Do something with data
        if (this.scope.attr('username')==='admin' && this.scope.attr('password')==='admin') {
          this.scope.attr('status', 'pass');
          setTimeout(function() { Navigator.openPage('landing') }, 2000);
        } else {
          this.scope.attr('status', 'fail');
        }
      });
      //});

  },
  
  'form submit'(){
      this.validateLogin();
      //Prevent default submit behavior
      return false;
  },  
  '.back click'() {
      Navigator.openPage('server');
  }
});