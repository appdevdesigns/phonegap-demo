'use strict';

import highchartsModule from 'highcharts';
const { Highcharts } = highchartsModule;

import Page from 'core/controls/page';

export default Page.extend('LandingControl', {
  pageId: 'landing',
  template: 'plugins/ops-portal/templates/landing.html',
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
    // By default they do not add a comma to our values
    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    });

    const income = 11365;
    const expenses = -11086;
    this.element.find('#average').highcharts(
      {
        colors: ['#3D9D50', '#DB1A23', '#000'],
        chart: {
          type: 'column',
          margin: 10,
        },
        title: {
          text: '',
        },
        xAxis: {
          categories: ['12 month average'],
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            groupPadding: 0,
            lineWidth: 100,
          },
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
              style: {
                textShadow: '0 0 3px black',
              },
            },
          },
        },
        series: [
          {
            name: 'Income',
            data: [income],
          }, {
            name: 'Expenses',
            data: [expenses],
          }, {
            type: 'spline',
            name: 'Average',
            data: [279],
            marker: {
              fillColor: income > expenses ? '#3D9D50' : '#DB1A23',
              lineColor: '#FFFFFF',
              lineWidth: 2,
              radius: 10,
              symbol: income > expenses ? 'triangle' : 'triangle down',
            },
          },
        ],
      }
    );
  },
});
