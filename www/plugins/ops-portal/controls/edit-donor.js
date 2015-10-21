'use strict';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';
import Donor from '../models/donor';

export default Page.extend('DonorEdit', {
  pageId: 'edit-donor',
  routeAttr: 'editDonorId',
  pattern: 'edit-donor/:editDonorId',
  template: 'plugins/ops-portal/templates/edit-donor.html',
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
  
  //TO DO: Implement Save Button
  //TO DO: Add donations type select
  
  setDonor(donor){
      this.scope.attr('donor', donor);
  },
  
  routeChange (event, editDonorId) {
      let donor = null;
      if (editDonorId === 'new') {
      // Create a new donor to edit
        donor = new Donor();
      }
      else{
        // Lookup the contact in the global list by its contact
        donor = Donor.store[editDonorId];
        if (donor) {
          //TO DO: Backup Donor
        }
        else{
         // No contact has that contactId
         console.error('Attempting to navigate to a non-existent donor!');
         Navigator.openParentPage();
        }
      }
      this.setDonor(donor);
  },

});