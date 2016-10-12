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
    this._super.apply(this, arguments);
	  
	// Listen for changes to the route  
    this.on('route.change', this.proxy('routeChange'));

    // Initialize the control scope and render it
    this.setDonor(null);
	this.render();
      
  
  },
  
  /**
   * Save donor data to the server and open the donor details page.
   *
   * @param DonorModel donor
   */
  saveDonor(donor) {
      this.scope.attr('loading', true);
      donor.save()
        .always(() => {
            this.scope.attr('loading', false);
        })
        .then(() => {
            Navigator.openPage('donor', {donorId: donor.donor_id});
        })
        .fail(() => {
            this.setError('Save failed. Please try again.');
        });
  },
  
  /**
   * Save a new relationship between this staff user and a donor.
   *
   * @param int donorID
   */
  saveRelation(donorID) {
      // Create a dummy donor model instance with just the donor_id attribute
      var donor = new Donor();
      donor.attr('donor_id', donorID);
      
      this.scope.attr('loading', true);
      
      // Saving this to the server will create a donor relation, and do nothing
      // else.
      Donor.saveRelation(donorID)
        .always(() => {
            this.scope.attr('loading', false);
        })
        .then(() => {
            Navigator.openPage('donor', {donorId: donorID});
        })
        .fail(() => {
            this.setError('Save failed. Please try again.');
        });
  },
  
  /**
   * Fetch a list of potential duplicate donor entries from the server.
   * 
   * @param DonorModel donor
   */
  findSimilar(donor) {
      donor.findSimilar()
        .then((list) => {
            if (list.length > 0) {
                this.showSimilar(donor, list);
            } else {
                this.saveDonor(donor);
            }
        })
        .fail((err) => {
            console.log('findsimilar error', err);
        });
  },
  
  /**
   * Show a popup dialog with choices for saving the newly entered donor data,
   * or using one of the existing similar matches already on file.
   *
   * @param DonorModel donor
   * @param array list
   *    An array of donor details
   */
  showSimilar(donor, list) {
        // Render html
        var dialog = this.element.find('#similar-donors');
        var domfrag = can.view('plugins/ops-portal/templates/similar-donors.html', {
            donor: donor,
            matches: list,
        });
        dialog.html(domfrag);
        
        // Attach donor data to DOM elements
        dialog.find('a.new-donor').data('donor', donor);
        dialog.find('a.existing-donor').each((index, element) => {
            // Possible that the donor data on the existing donors is not
            // complete. We really only need the donor_id here.
            $(element).data('donor', list[index]);
        });
        
        // Init widgets
        dialog.popup({
            dismissible: false,
            hisotry: false,
            positionTo: 'window',
            overlayTheme: 'b',
            afterClose(ev, ui) {
                dialog.popup('destroy');
            }
        });
        dialog.find('ul').listview();
        
        dialog.popup('open');
  },
  
  '.back click'() {
      window.history.back();
  },
  
  '.save click'(el, ev) {
      var donor = this.scope.attr('donor');
      var values = this.element.find('form').serializeArray();
      values.forEach((value) => {
          donor.attr(value.name, value.value);
      });
      
      if (donor.donor_id) {
          // Save changes to existing donor
          this.saveDonor(donor);
      } else {
          // New donor entry. Check if donor is already on file.
          this.findSimilar(donor);
      }
      
      // Prevent default submit behavior
      ev.preventDefault();
      return false;
  },
  
  /**
   * Handle clicks from within the Similar Donors popup dialog
   */
  '#similar-donors a click'(el, ev) {
    ev.preventDefault();
    
    var donor = el.data('donor');
    if (el.hasClass('new-donor')) {
        this.saveDonor(donor);
    } 
    else if (el.hasClass('existing-donor')) {
        this.saveRelation(donor.donor_id);
    }
  },
  
  setError(error){
    this.scope.attr('error', error);
  },
  
  setDonor(donor){
      this.scope.attr('donor', donor);
  },
  
  routeChange (event, editDonorId) {
      this.setError('');
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
         // No donor has that donorId
         console.error('Attempting to navigate to a non-existent donor!');
         Navigator.openParentPage();
        }
      }
      this.setDonor(donor);
  },
  
});