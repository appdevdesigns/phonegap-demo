'use strict';

import AccountModel from '../models/account';
import highchartsModule from 'highcharts';
const { Highcharts } = highchartsModule;
import Navigator from 'core/navigator';

import Page from 'core/controls/page';

export default Page.extend('AccountControl', {
  pageId: 'account',
  parentId: 'landing',
  template: 'plugins/ops-portal/templates/account.html',
},
  {
    // Initialize the control
    init(element) {
      var _this = this;

      // Call the Page constructor
      this._super(...arguments);

      // Initialize the control scope and render it
      this.render();

      this.element.on('pageshow', () => {

        AccountModel.findAll()
          .fail(function (err) {
            console.log(err);
          })
          .then((list) => {
            const avePercentRedThreshold = 80
            const avePercentYellowThreshold = 100
            const monthsLeftRedThreshold = 1
            const monthsLeftYellowThreshold = 3

            // update bar chart
            this.updateChart(list);

            var numMonths = ((list.length - 1) < 12) ? (list.length() - 1) : 12;
            var aveIncome = 0; // average income past 12 months
            var aveExpenses = 0; // average expenses past 12 months
            var aveDelta = 0; // average difference between income and expenses
            for (var i = 1; i <= numMonths; ++i) {
              aveIncome += list[i].income;
              aveExpenses += list[i].expenses;
              aveDelta += list[i].income - list[i].expenses;
            }
            aveIncome /= numMonths;
            aveExpenses /= numMonths;
            aveDelta /= numMonths;

            var avePercent = (aveIncome / aveExpenses) * 100;

            var avePercentBg = 'green'; // average % background
            if (avePercent < avePercentRedThreshold) {
              avePercentBg = 'red';
            } else if (avePercent < avePercentYellowThreshold) {
              avePercentBg = 'yellow';
            }

            var monthsLeftBg = 'green'; // months left background
            var monthsLeft;
            if (aveDelta < 0) {
              monthsLeft = list[0].beginningBalance / -aveDelta;
              if (monthsLeft < monthsLeftRedThreshold) {
                monthsLeftBg = 'red';
              } else if (monthsLeft < monthsLeftYellowThreshold) {
                monthsLeftBg = 'yellow';
              }

            }
            else {
              monthsLeft = "<i class='fa fa-thumbs-o-up'></i>";
            }

            // assign scope variables
            this.scope.attr('periods', list);
            this.scope.attr('balance', list[0].beginningBalance - list[0].expenses)
            this.scope.attr('avePercent', avePercent.toFixed(0) + "%");
            this.scope.attr('avePercentBg', avePercentBg);
            this.scope.attr('monthsLeft', monthsLeft);
            this.scope.attr('monthsLeftBg', monthsLeftBg);

          })

        });
    },

    updateChart(list) {

      var incomeData = [];
      var expenseData = [];
      var netData = [];
      var monthData = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      var numMonths = 12; // number of months to plot
      if (list.length < numMonths) {
        numMonths = list.length();
      }
      // We expect to receive period data newest to oldest.
      // We need to reverse the data order in the chart.
      for (var i = (numMonths - 1); i >= 0; --i) {
        incomeData.push(list[i].income);
        expenseData.push(-list[i].expenses);
        netData.push(list[i].income - list[i].expenses);
        var date = new Date(list[i].date);
        monthData.push(monthNames[date.getMonth()]);
      };

      $('#year').highcharts({
        colors: ['#3D9D50', '#DB1A23', '#000'],
        chart: {
          type: 'column'
        },
        title: {
          text: 'Income, Expenses'
        },
        xAxis: {
          categories: monthData
        },
        yAxis: {
          title: "",
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            groupPadding: 0
          }
        },
        series: [{
          name: 'Income',
          data: incomeData
        }, {
            name: 'Expenses',
            data: expenseData
          }, {
            type: 'spline',
            name: 'Net',
            data: netData,
            marker: {
              lineWidth: 2
            }
          }]
      });
    },

    '.back click'() {
      Navigator.openParentPage();
    },

    '.period click'(element) {
      const periodId = $(element).data('id');
      Navigator.openPage('period-income-expenses', {
        periodId: periodId,
      });
    },

  });
