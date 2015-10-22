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
}, {
  name: can.compute(function() {
    return `${this.attr('donors_firstName')} ${this.attr('donors_lastName')}`;
  }),
});
