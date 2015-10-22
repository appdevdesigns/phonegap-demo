'use strict';

// Load controls
import Landing from './controls/landing';
import Server from './controls/server';
import Authenticate from './controls/authenticate';
// Load models
import Navigator from 'core/navigator';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    if (window.localStorage.getItem('serverURL')) {
        Navigator.activate('landing');
    } else {
        Navigator.activate('server')
    }
  },

  controls: { Landing, Server, Authenticate },
  models: {},
};

export default plugin;
