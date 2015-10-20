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
      .fail(function(err){
        console.log(err);
      })
      .then((list) => {
        this.updateChart(list);
      })
    },

    updateChart(list) {

      var incomeData = [];
      var expenseData = [];
      var netData = [];
      
      list.forEach(function(item) {
        incomeData.push(item.income);
        expenseData.push(-item.expenses);
        netData.push(item.income - item.expenses);
      }, this);
      
      $('#year').highcharts({
        colors: ['#3D9D50', '#DB1A23', '#000'],
        chart: {
          type: 'column'
        },
        title: {
          text: 'Income, Expenses'
        },
        xAxis: {
          categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep']
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
