'use strict';

import Navigator from 'core/navigator';
import Config from 'core/config';

// Load controls
import Landing from './controls/landing';
import Account from './controls/account';
import Donors from './controls/donors';
import Donor from './controls/donor';
import Server from './controls/server';
import EditDonor from './controls/edit-donor';
import PeriodIncomeExpenses from './controls/period-income-expenses';
import Authenticate from './controls/authenticate';
import AddDonation from './controls/add-donation';

// Load models
import DonationsModel from './models/donations';
import DonorModel from './models/donor';
import AccountModel from './models/account';
import TransactionModel from './models/transaction';


const plugin = {
  // Initialize the plugin
  initialize() {
    // Activate the Navigator, which will setup routing and load the initial page
    if (Config.getServer()) {
        Navigator.activate('login');
    } else {
        Navigator.activate('server')
    }
  },

  controls: { Landing, Account, Donors, Donor, Server, EditDonor, PeriodIncomeExpenses, Authenticate, AddDonation },
  models: { DonorModel, AccountModel, DonationsModel, TransactionModel },

};

export default plugin;
