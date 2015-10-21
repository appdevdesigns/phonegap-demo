'use strict';
// Load the control's parent
import './donors';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';

// Import Models
import Donor from '../models/donor';
import Donations from '../models/donations';


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
    
    // Load donations from server
    Donations.findAll({ donor_id: can.route.attr('donorId') })
    .fail(function(err){
        console.log(err);
    })
    .then((list) => {
        this.scope.attr('donations', list );
    })
    

  },
  
  '.back click'() {
      Navigator.openParentPage();
  
  },
  
  '.edit click'() {
	  const donorId = this.scope.donor.donor_id;
      Navigator.openPage('edit-donor', { editDonorId: donorId });  
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