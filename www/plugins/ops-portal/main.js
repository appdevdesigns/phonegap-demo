'use strict';

// Load controls
import Landing from './controls/landing';

// Load models
import Navigator from 'core/navigator';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    Navigator.activate('landing');
  },

  controls: { Landing },
  models: {},
};

export default plugin;