'use strict';

import can from 'can';
import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('DonorModel', {
  id: 'id',
//  hasUuid: true,
  url: 'opstool-donations/donor',
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
    donors_spouseFirstName: null,
    donors_spouseLastName: null,
    donors_postalCode: null,
    donors_province: null,
    donors_address: null,
    donors_country: null,
    donors_city: null,
    donors_homePhone: null,
    donors_email: null,
    donors_cellPhone: null,
    donors_type: null,
    donors_nationality: null,
    donors_chineseName: null
  },
}, {
  name: can.compute(function() {
    return `${this.attr('donors_firstName')} ${this.attr('donors_lastName')}`;
  }),
});
