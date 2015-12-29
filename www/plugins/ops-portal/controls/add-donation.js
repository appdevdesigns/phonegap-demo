'use strict';
// Load the control's parent
import './donor';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';

import Donor from '../models/donor';
import Donation from '../models/donations';

export default Page.extend('AddDonation', {
  pageId: 'add-donation',
  parentId: 'donor',
  routeAttr: 'addDonorId',
  pattern: 'add-donation/:addDonorId',
  template: 'plugins/ops-portal/templates/add-donation.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super(...arguments);
	  
    // Listen for changes to the route  
    this.on('route.change', this.proxy('routeChange'));

    // Initialize the control scope and render it
	this.render();
  
    this.scope.attr('date', function (){
      var date = new Date();
      var dateString = date.toISOString();
      return dateString.slice(0, 10);
    });
  },
  
  '.back click'(el, ev) {
      Navigator.openParentPage();
  },
  
  '.add click' (el, ev) {
      ev.preventDefault();
      
      var donation = new Donation;
      var values = this.element.find('form').serializeArray();
      values.forEach((value) => {
          donation.attr(value.name, value.value);
      });
      donation.donor_id = this.scope.donor.donor_id;
      console.log(donation);
      donation.save()    
        .then(() => {
            Navigator.openParentPage();
        })
        .fail(() => {
            console.log('Save failed. Please try again.');
        });
  },
  
  setDonor(donor){
      this.scope.attr('donor', donor);
  },
  
  routeChange (event, addDonorId) {
      let donor = null;
      
      // Lookup the contact in the global list by its contact
      donor = Donor.store[addDonorId];
      if (!donor) {
        // No contact has that contactId
        console.error('Attempting to navigate to a non-existent donor!');
        Navigator.openParentPage();
      }
    
      this.setDonor(donor);
  },
  
});