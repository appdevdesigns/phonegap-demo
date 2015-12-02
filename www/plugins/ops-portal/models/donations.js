'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('Donations', {
  id: 'donItem_id',
  url: 'opstool-donations-stewardwise/donations',
  attributes: {
    id: 'string|primaryKey|unique',
    donor_id: 'string',
    donor_name: 'string',
    donItem_dateReceived: 'string',
    donItem_amount: 'real',
    donItem_type: 'string',
  },
  defaults: {
    donor_id: '',
    donor_name: '',
    donItem_dateReceived: '',
    donItem_amount: 0,
    donItem_type: '',
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
