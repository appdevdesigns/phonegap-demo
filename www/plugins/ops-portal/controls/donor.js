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
//    Donations.findAll({ donor_id: can.route.attr('donorId') })
//    .fail(function(err){
//        console.log(err);
//    })
//    .then((list) => {
      
      var tempList = Donations.list;
      var donationsArray = [];
      for(var donation in templist){
    //      if (donation.donor_id ===)
        donationsArray.push(donation);
      }
      var list = donationsArray.sort(function(a,b){
        if(parseDate(a.donItem_dateReceived) > parseDate(b.donItem_dateReceived)){
           return 1;
        }
        if(parseDate(a.donItem_dateReceived) < parseDate(b.donItem_dateReceived)){
          return -1;
        }
        else {
          return 0;
        }
      });
    
      this.scope.attr('donations', tempList);
        
    },
    
  '.back click'() {
      Navigator.openParentPage();
  
  },
  
  '.edit click'() {
	  const donorId = this.scope.donor.id;
      Navigator.openPage('edit-donor', { editDonorId: donorId });  
  },
  
  '.add-donation click'(){
      const donorId = this.scope.donor.id;
      Navigator.openPage('add-donation', { 
         addDonorId: donorId 
      });  
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
  
  parseDate(dateString){
        var dateStrings = dateString.split('-');
        var date = new Date(dateStrings[0], dateStrings[1], dateStrings[2]);
        return date;
  },
  
  sortByDate(donations){
    var donationsArray = [];
    for(var donation in donations){
//      if (donation.donor_id ===)
      donationsArray.push(donation);
    }
    donationsArray.sort(function(a,b){
        if(parseDate(a.donItem_dateReceived) > parseDate(b.donItem_dateReceived)){
           return 1;
        }
        if(parseDate(a.donItem_dateReceived) < parseDate(b.donItem_dateReceived)){
          return -1;
        }
        else {
          return 0;
        }
      });
    return donationsArray;
    },
  
});