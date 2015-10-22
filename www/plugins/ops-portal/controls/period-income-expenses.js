'use strict';
// Load the controller's parent
import './account';

import Navigator from 'core/navigator';
import Page from 'core/controls/page';
import can from 'can';

// Import Models
import Account from '../models/account';
import Transactions from '../models/transaction';


export default Page.extend('PeriodIncomeExpenses', {
    pageId: 'period-income-expenses',
    parentId: 'account',
    routeAttr: 'periodId',
    template: 'plugins/ops-portal/templates/period-income-expenses.html',
}, {
        // Initialize the control
        init(element) {
            // Call the Page constructor
            this._super(...arguments);

            // Listen for changes to the route
            this.on('route.change', this.proxy('routeChange'));

            // Initialize the control scope and render it
            this.render();

        },

        '.back click'() {
            Navigator.openParentPage();
        },

        routeChange(event, periodId) {
            // Load transactions from server
            Transactions.findAll({ period_id: periodId })
                .fail(function (err) {
                    console.log(err);
                })
                .then((list) => {
                    // TODO: remove this when findAll() actually filters by periodId
                    var filteredList = this.filterByPeriod(list, periodId);
                    var period = Account.store[periodId];
                    this.calculateTotals(period, filteredList);
                });
        },

        calculateTotals(period, transactions) {
            let incomeTotal = 0;
            let expensesTotal = 0;
            let incomeCategoryTotals = new Map();
            let expenseCategoryTotals = new Map();

            transactions.forEach(function (item) {
                if (0 < item.credit) {
                    incomeTotal += item.credit;
                    if ( incomeCategoryTotals.has(item.category) ) {
                        incomeCategoryTotals.set(item.category, incomeCategoryTotals.get(item.category) + item.credit);
                    }
                    else {
                        incomeCategoryTotals.set(item.category, item.credit);
                    }
                 }
                else { // expense
                    expensesTotal += item.debit;
                    if ( expenseCategoryTotals.has(item.category) ) {
                        expenseCategoryTotals.set(item.category, expenseCategoryTotals.get(item.category) + item.debit);
                    }
                    else {
                        expenseCategoryTotals.set(item.category, item.debit);
                    }
                }
            });

            // Add values to scope
            this.scope.attr('periodDate', period.date);
            this.scope.attr('previousBalance', period.beginningBalance);
            this.scope.attr('incomeTotal', incomeTotal);
            this.scope.attr('expensesTotal', expensesTotal);
            this.scope.attr('incomeCategoryTotals', [...incomeCategoryTotals.entries()]);
            this.scope.attr('expenseCategoryTotals', [...expenseCategoryTotals.entries()]);

        },
        //TODO: remove this when findAll() filters by period id
        filterByPeriod(list, periodId) {
            var filteredList = [];
            list.forEach(function (item) {
                if (item.period == periodId) {
                    filteredList.push(item);
                }
            })
            return filteredList;
        }

    });