'use strict';

import Highcharts from 'highcharts';
import Page from 'core/controls/page';
import Navigator from 'core/navigator';
import Config from 'core/config';

export default Page.extend('LandingControl', {
  pageId: 'landing',
  template: 'plugins/ops-portal/templates/landing.html',
}, {
  // Initialize the control
  init(element) {
    // Call the Page constructor
    this._super.apply(this, arguments);

    // Initialize the control scope and render it
    this.checkServer();
    
    /*
    setInterval(() => {
      //Every X seconds
      this.checkServer();
    }, 20000);
    */
    
    Config.on('serverChanged', (newURL) => {
        this.scope.attr('serverErr', false);
    });
    
    this.app.modelsLoaded.then(() => {
        var mpd = MpdModel.list.attr(0);
        this.scope.attr('mpd', mpd);
    });
    
    this.render();

    this.element.one('pageshow', () => {
      this.initializeHighcharts();
    });
    
  },
  
  checkServer() {
    var currentServer = Config.getServer();
    if (currentServer) {
      Config.loadConfig(currentServer).then(() => {
        //Success, no need to warn anyone
        this.scope.attr('serverErr', false);
      })
      .fail(err => {
        //Failed, warn the user
        //console.log('Could not connect to '+currentServer+'. Check the IP and your VPN.');
        this.scope.attr('serverErr', true);
        //alert('Warning: Unable to connect to the server. Is your VPN on?');
      })
    } else {
      //...What?
      console.log('How did you even get to this page?');
    }
  },
  
  initializeHighcharts() {
    // By default they do not add a comma to our values
    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    });
    
    this.app.modelsLoaded
      .then(() => {
        var list = AccountModel.list;
        var income = 0,
            expenses = 0;
        for (var i=0; i<list.length; i++) {
            income += Number(list[i].income);
            expenses -= Number(list[i].expenses);
        }
        income /= list.length;
        expenses /= list.length;
        
        const chartContainer = this.element.find('#average');
        const chartOptions = {
            colors: ['#3D9D50', '#DB1A23', '#000'],
            chart: {
              type: 'column',
              margin: 10,
            },
            title: {
              text: '',
            },
            xAxis: {
              categories: ['Monthly average'],
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
                tooltip: {
                    valueDecimals: 2,
                },
                dataLabels: {
                  format: "{point.y:.2f}",
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
                data: [income + expenses],
                tooltip: {
                    valueDecimals: 2,
                },
                marker: {
                  fillColor: income > expenses ? '#3D9D50' : '#DB1A23',
                  lineColor: '#FFFFFF',
                  lineWidth: 2,
                  radius: 10,
                  symbol: income > expenses ? 'triangle' : 'triangle down',
                },
                
              },
            ],
        };
        
        // Don't init the chart until the container is visible.
        // Current page may have changed while data was loading.
        if (chartContainer.is(':visible')) {
            chartContainer.highcharts(chartOptions);
        } else {
            this.element.one('pageshow', () => {
                chartContainer.highcharts(chartOptions);
            });
        }
    });
  },

  '#average click'(element, event) {
    Navigator.openPage("account");
  },
  
  '#mpd-quickview a click'(element, event) {
    event.preventDefault();
    Navigator.openPage('mpd');
  },

  '.donors click'() {
      Navigator.openPage('donors');
  },
  
  '.edit-server-url click'() {
    Navigator.openPage('server');
  },
});
