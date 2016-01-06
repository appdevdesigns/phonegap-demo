'use strict';
// Load the control's parent
import './landing';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';

// Import Models
import Mpd from '../models/mpd';


export default Page.extend('MpdReport', {
  pageId: 'mpd',
  parentId: 'landing',
  template: 'plugins/ops-portal/templates/mpd-report.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);
    
    this.scope.attr('mpdList', Mpd.list);
    
    // Initialize the control scope and render it
    this.render();
    
  },
  
  '.back click'() {
      Navigator.openParentPage();
  },
  
});