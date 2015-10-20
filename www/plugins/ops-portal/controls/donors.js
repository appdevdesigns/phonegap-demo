'use strict';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';

export default Page.extend('Donors', {
  pageId: 'donors',
  template: 'plugins/ops-portal/templates/donors.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);

    // Initialize the control scope and render it
    this.render();

  },
  
  '.back click'() {
      Navigator.openPage('landing');
  },

  
});