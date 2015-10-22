'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('TransactionModel', {
	id: 'transaction_id',
	url: 'opstool-account/account/transaction',
	attributes: {
		transaction_id: 'int|primarykey|autoincrement|unique',
		period_id: 'int',
		date: 'string',
		description: 'string',
		credit: 'real',
		debit: 'real',
		category: 'string',
	},
	dbAttributes: {
		transaction_id: 'int|primarykey|autoincrement|unique',
	},
	defaults:
	{
		period_id: 0,
		date: '',
		description: '',
		credit: 0,
		debit: 0,
		category: '',
	},
}, {});
