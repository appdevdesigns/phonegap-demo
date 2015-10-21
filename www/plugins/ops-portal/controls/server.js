'use strict';

import $ from 'jquery';
import can from 'can';
import Page from 'core/controls/page';
import Navigator from 'core/navigator';

const fillerText = 'http://173.16.6.59:1337/mobile/policy';
export default Page.extend('ServerControl', {
  pageId: 'server',
  template: 'plugins/ops-portal/templates/server.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);

    // Initialize the control scope and render it
    this.scope.attr('server', window.localStorage.getItem('serverURL') || fillerText);

    ['validating', 'good', 'noResponse', 'badResponse'].forEach(state => {
      this.scope.attr(state, can.compute(() => {
        return this.scope.attr('status') === state;
      }));
    });

    this.render();
  },

  validateServer:function() {
    this.scope.attr('status', 'validating');
    const serverURL = this.scope.attr('server');
    $.ajax({
      url: serverURL,
    })
    .fail((err, textStatus, errorThrown) => {
      console.log(err);

      // if status not found
      if (err.status === 0) {
        this.scope.attr('status', 'noResponse');
      } else if (err.status >= 400 && err.status < 500) {
        this.scope.attr('status', 'badResponse');
      }
    }).then((data) => {
      // Do something with data
      this.scope.attr('status', 'good');
      window.localStorage.setItem('serverURL', serverURL);
      setTimeout(() => {
        Navigator.openPage('landing')
      }, 5000);
    });
  },

  'form submit'() {
    this.validateServer();

    //Prevent default submit behavior
    return false;
  },

  '.back click'() {
    Navigator.openPage('landing');
  },
});
