'use strict';

import AccountModel from '../models/account';
import highchartsModule from 'highcharts';
const { Highcharts } = highchartsModule;

import Page from 'core/controls/page';

export default Page.extend('AccountControl', {
  pageId: 'account',
  template: 'plugins/ops-portal/templates/account.html',
},
  {
    // Initialize the control
    init(element) {
      // Call the Page constructor
      this._super(...arguments);

      // Initialize the control scope and render it
      this.render();

      AccountModel.findAll()
        .fail(function (err) {
          console.log(err);
        })
        .then((list) => {
          this.scope.attr('periods', list);
          this.updateChart(list);
        })
    },

    updateChart(list) {

      var incomeData = [];
      var expenseData = [];
      var netData = [];
      var monthData = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      // We expect to receive period data newest to oldest.
      // We need to reverse the data order in the chart and
      // plot the previous 12 periods.
      for (var i = 11; i >= 0; --i) {
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
  });
