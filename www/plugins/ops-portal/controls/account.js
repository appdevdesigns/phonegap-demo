'use strict';

import highchartsModule from 'highcharts';
const { Highcharts } = highchartsModule;

import Page from 'core/controls/page';

export default Page.extend('AccountControl', {
  pageId: 'account',
  template: 'plugins/ops-portal/templates/account.html',
}, {
    // Initialize the control
    init(element) {
      // Call the Page constructor
      this._super(...arguments);

      // Initialize the control scope and render it
      this.render();

      this.initializeHighcharts();
    },

    initializeHighcharts() {
 
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
          data: [11102, 12410, 19758, 11740, 10500, 12640, 7921, 10388, 8472, 10122, 9082, 12243]
        }, {
            name: 'Expenses',
            data: [-10344, -12920, -12178, -11747, -11492, -9763, -10422, -11401, -12838, -9709, -9878, -10336]
          }, {
            type: 'spline',
            name: 'Average',
            data: [758, -510, 7580, -7, -992, 2877, -2501, -1013, -4366, 413, -796, 1907],
            marker: {
              lineWidth: 2
            }
          }]
      });
    },
  });
