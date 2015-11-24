'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('Donations', {
  id: 'id',
  url: 'opstool-donations-stewardwise/donations',
  attributes: {
    id: 'string|primaryKey|unique',
    donor_id: 'string',
    donItem_dateReceived: 'string',
    donItem_amount: 'real',
    donItem_type: 'string',
  },
  defaults: {
    donor_id: '',
    donItem_dateReceived: '',
    donItem_amount: 0,
    donItem_type: '',
  },
}, {});
