'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('AccountModel', {
	id: 'id',
	url: 'opstool-account/account/period',
	attributes: {
		id: 'int|primarykey|autoincrement|unique',
		date: 'string', // starting date of period
		beginningBalance: 'real',
		income: 'real',
		expenses: 'real',
		closed: 'int' // 0 = open, 1 = closed
	},
	dbAttributes: {
		id: 'int|primarykey|autoincrement|unique',
	},
	defaults: {
		date: '',
		beginningBalance: 0,
		income: 0,
		expenses: 0,
		closed: 0
	},
}, {});