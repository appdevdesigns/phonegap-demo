'use strict';

import can from 'can';
import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('DonorModel', {
  id: 'donor_id',
//  hasUuid: true,
  url: 'opstool-donations-stewardwise/donor',
  attributes: {
    id: 'string|primarykey|unique',
    donors_firstName: 'string',
    donors_lastName: 'string',
    donors_spouseFirstName: 'string',
    donors_spouseLastName: 'string',
    donors_postalCode: 'string',
    donors_province: 'string',
    donors_address: 'string',
    donors_country: 'string',
    donors_city: 'string',
    donors_homePhone: 'string',
    donors_email: 'string',
    donors_cellPhone: 'string',
    donors_type: 'string',
    donors_nationality: 'string',
    donors_chineseName: 'string'
  },
  defaults: {
    donors_firstName: '',
    donors_lastName: '',
    donors_spouseFirstName: '',
    donors_spouseLastName: '',
    donors_postalCode: '',
    donors_province: '',
    donors_address: '',
    donors_country: '',
    donors_city: '',
    donors_homePhone: '',
    donors_email: '',
    donors_cellPhone: '',
    donors_type: '',
    donors_nationality: '',
    donors_chineseName: ''
  },
  
  /**
   * Fetches a list of potential matches to the given set of data.
   *
   * For privacy and access control reasons, the data returned in the list may
   * not necessarily contain all details of the matching donors. It is not 
   * the same as an array of proper DonorModel instances.
   */
  findSimilar(params) {
    return this.request({
        url: '/similar',
        params,
        method: 'GET'
    });
  },
  
  /**
   * Creates/activates a relation between the current staff and a donor.
   *
   * Uses the same server route as create/update but sends no data besides
   * the donor_id.
   */
  saveRelation(donorID) {
    return this.request({
        url: '/' + donorID,
        method: 'PUT'
    })
    .then(data => {
        // Instantiate a new model instance with the returned data.
        const model = new DonorModel();
        for (var key in data) {
            model.attr(key, data[key]);
        }
        model.isSaved = true;
        
        // Make sure the data gets put into the local cache.
        model.created(data);
        
        return model;
    });
  }

}, {
  name: can.compute(function() {
    return `${this.attr('donors_firstName')} ${this.attr('donors_lastName')}`;
  }),
  
  findSimilar() {
    var params = this.serialize();
    return DonorModel.findSimilar(params);
  },
  
  saveRelation() {
    var donorID = this.attr('donor_id');
    return DonorModel.saveRelation(donorID);
  }
  
});
