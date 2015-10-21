'use strict';

import Navigator from 'core/navigator';

// Load controls
import Landing from './controls/landing';
import Account from './controls/account';
import Donors from './controls/donors';
import Donor from './controls/donor';
import Server from './controls/server';
import EditDonor from './controls/edit-donor';

// Load models
import DonationsModel from './models/donations';
import DonorModel from './models/donor';
import AccountModel from './models/account';

const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    Navigator.activate('landing');
  },

  controls: { Landing, Account, Donors, Donor, Server, EditDonor },
  models: { DonorModel, AccountModel, DonationsModel },

};

export default plugin;
