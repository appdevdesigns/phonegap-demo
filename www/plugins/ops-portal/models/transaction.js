'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('TransactionModel', {
	id: 'id',
	url: 'opstool-account/account/transaction',
	attributes: {
		id: 'string',
		period: 'string',
		date: 'string',
		description: 'string',
		credit: 'real',
		debit: 'real',
		category: 'string',
	},
	defaults:
	{
		id: '',
		period: '',
		date: '',
		description: '',
		credit: 0,
		debit: 0,
		category: '',
	},
}, {});
