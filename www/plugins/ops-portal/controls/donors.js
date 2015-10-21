'use strict';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';
import Donor from '../models/donor';

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
      
    Donor.findAll()
    .fail(function(err){
        console.log(err);
    })
    .then((list) => {
      this.scope.attr('donors', list);
    })
  },
  
  '.back click'() {
      Navigator.openParentPage();
  },
    
  '.add click'() {
      Navigator.openPage('edit-donor', {editDonorId: 'new'});
  },
    
  '.donor click'(element){
      const donorId = $(element).data('id');

    // Open the clicked donor
    Navigator.openPage('donor', {
      donorId: donorId,
    });   
  },
  
});