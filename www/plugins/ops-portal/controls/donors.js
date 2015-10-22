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

    //Get Donor list from Server
    this.scope.attr('donors', Donor.list);
    
    const donors= this.donors = Donor.list;
    
    // Initialize the control scope and render it
    this.render();
    
    // Initialize the jQuery Mobile listview component
    this.$listview = element.find('ul');
    this.$listview.listview();
    
    // Refresh the donors UI list whenever donors are added
    const refresh = this.proxy('refresh');
    donors.bind('change', refresh);
    donors.bind('length', refresh);
    refresh();
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
   
  /*
   * Update the jQuery Mobile listview element.
   *
   * This must be called to update the UI whenever items are added to the listview.
   */
  refresh() {
    this.$listview.listview('refresh');
  },
});