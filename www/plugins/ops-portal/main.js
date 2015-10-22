'use strict';

// Load controls
import Landing from './controls/landing';
import Server from './controls/server';
import Authenticate from './controls/authenticate';
// Load models
import Navigator from 'core/navigator';
import Config from 'core/config';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    if (Config.getServer()) {
        Navigator.activate('landing');
    } else {
        Navigator.activate('server')
    }
  },

  controls: { Landing, Server, Authenticate },
  models: {},
};

export default plugin;
