'use strict';

// Load controls
import Landing from './controls/landing';
import Account from './controls/account';
import Donors from './controls/donors';


// Load models
import Navigator from 'core/navigator';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    Navigator.activate('landing');
      
  },

  controls: { Landing, Account, Donors },
  models: {},
};

export default plugin;
