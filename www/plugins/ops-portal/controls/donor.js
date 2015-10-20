'use strict';
// Load the control's parent
import './donors';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';
import Donor from '../models/donor';


export default Page.extend('Donor', {
  pageId: 'donor',
  parentId: 'donors',
  routeAttr: 'donorId',
  template: 'plugins/ops-portal/templates/donor.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);
      
    // Listen for changes to the route  
    this.on('route.change', this.proxy('routeChange'));

    // Initialize the control scope and render it
    this.setDonor(null);
    this.render();
    
    

  },
  
  '.back click'() {
      Navigator.openParentPage();
  },
    
  setDonor(donor) {
      this.scope.attr('donor', donor);
  },
    
  routeChange(event, donorId) {
      let donor = null;
      // Lookup the contact in the global list by its contact
      donor = Donor.store[donorId];
      if (!donor) {
         // No contact has that contactId
         console.error('Attempting to navigate to a non-existent donor!');
         Navigator.openParentPage();
      }
      this.setDonor(donor);
  },

  
});