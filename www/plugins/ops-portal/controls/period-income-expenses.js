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
        
        'a.prev-btn click'(el, ev) {
            ev.preventDefault();
            var id = this.scope.attr('prev-id');
            if (id) {
                Navigator.openPage('period-income-expenses', {
                    periodId: id
                });
            }
        },
        
        'a.next-btn click'(el, ev) {
            ev.preventDefault();
            var id = this.scope.attr('next-id');
            if (id) {
                Navigator.openPage('period-income-expenses', {
                    periodId: id
                });
            }
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
            let incomeCategories = {};
            let expenseCategories = {};
            
            transactions.forEach(function (item) {
                let type = item.type;
                // Income
                if (0 < item.credit) {
                    incomeTotal += item.credit;
                    incomeCategories[type] = incomeCategories[type] || 0;
                    incomeCategories[type] += item.credit;
                }
                // Expense
                else {
                    expensesTotal += item.debit;
                    expenseCategories[type] = expenseCategories[type] || 0;
                    expenseCategories[type] += item.debit;
                }
            });
            
            // Round totals to 2 decimal places & convert into arrays for the
            // stache template
            var incomeCategoryTotals = [];
            for (var type in incomeCategories) {
                incomeCategoryTotals.push({
                    category: type,
                    total: incomeCategories[type].toFixed(2)
                });
            }
            var expenseCategoryTotals = [];
            for (var type in expenseCategories) {
                expenseCategoryTotals.push({
                    category: type,
                    total: expenseCategories[type].toFixed(2)
                });
            }
            
            // Add values to scope
            this.scope.attr('periodDate', period.formattedDate());
            this.scope.attr('previousBalance', period.beginningBalance);
            this.scope.attr('incomeTotal', incomeTotal.toFixed(2));
            this.scope.attr('expensesTotal', expensesTotal.toFixed(2));
            this.scope.attr('incomeCategoryTotals', incomeCategoryTotals);
            this.scope.attr('expenseCategoryTotals', expenseCategoryTotals);

        },
        
        //TODO: remove this when findAll() filters by period id
        filterByPeriod(list, periodId) {
            var filteredList = [];
            var periods = [];
            
            list.forEach(function (item) {
                if (item.period == periodId) {
                    filteredList.push(item);
                }
                if (periods.indexOf(String(item.period)) < 0) {
                    periods.push(String(item.period));
                }
            });
            
            periods.sort();
            var index = periods.indexOf(String(periodId));
            this.scope.attr('prev-id', periods[index-1]);
            this.scope.attr('next-id', periods[index+1]);
            
            return filteredList;
        }

    });