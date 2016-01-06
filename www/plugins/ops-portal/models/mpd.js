'use strict';

import RemoteModel from 'core/remote-model';

export default RemoteModel.extend('MpdModel', {
	id: 'id',
	url: 'opstool-mpd-stewardwise/mpd',
	attributes: {
		id: 'int',
		mpdGoal: 'real',
		avgIncome: 'real',
		avgExpense: 'real',
		percentForeignContrib: 'int',
		percentLocalContrib: 'int',
		needRemaining: 'int',
		percentOfNeed: 'int'
	},
	defaults: {}
}, {
    hundredPercent() {
        return (this.attr('percentOfNeed') >= 100);
    }
});
