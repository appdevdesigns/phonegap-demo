'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('Donations', {
  id: 'donItem_id',
  url: 'opstool-donations-stewardwise/donations',
  attributes: {
    id: 'string|primaryKey|unique',
    donor_id: 'string',
    donItem_dateReceived: 'string',
    donItem_amount: 'real',
    donItem_type: 'string',
    donItem_description: '',
    donor_name: 'string', // read-only
  },
  defaults: {
    donor_id: '',
    donItem_dateReceived: '',
    donItem_amount: 0,
    donItem_type: '',
    donItem_description: '',
  },
  
}, {
    
    formattedDate() {
	   var date = new Date(this.donItem_dateReceived);
	   return date.getFullYear() 
	       + '-' + (date.getMonth()+1) 
	       + '-' + date.getDate();
	   // return date.toLocaleDateString();
    }

});
