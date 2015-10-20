'use strict';

// Load controls
import Landing from './controls/landing';
import Account from './controls/account';
import Donors from './controls/donors';
import Donor from './controls/donor';


// Load models
import Navigator from 'core/navigator';
import DonorModel from './models/donor';
import AccountModel from './models/account';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    Navigator.activate('landing');
  },

  controls: { Landing, Account, Donors, Donor },
  models: { DonorModel, AccountModel },
};

export default plugin;
