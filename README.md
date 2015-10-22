phonegap-demo
=============

[![devDependency Status](https://david-dm.org/canac/phonegap-demo/dev-status.svg)](https://david-dm.org/canac/phonegap-demo#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/canac/phonegap-demo/badges/gpa.svg)](https://codeclimate.com/github/canac/phonegap-demo)

PhoneGap local storage demonstration app

To install and run the app:
```sh
# Install required command line tools (may require root access)
$ [sudo] npm install -g cordova bower

# Clone this repo
$ git clone https://github.com/canac/phonegap-demo.git
$ cd phonegap-demo

# Install Bower components
$ bower install

# Prepare for running (installs Cordova platforms and plugins)
$ cordova prepare

# Test/Run in Android 

$ cordova run android --emulator
$ cordova run android --device

# Test/Run on iOS 
$ npm install ios-sim --save
$ cordova run ios --emulator
$ cordova run ios --device

```

During development:
```sh
# Install required command line tools (may require root access)
$ [sudo] npm install -g grunt-cli jshint jscs
# Install dev dependencies used by the Gruntfile
$ npm install

# Start development server
$ grunt serve
# Open app in browser
$ open http://localhost:8000/browser/www/

# Run JSHint and JSCS on the source files
grunt
# Rerun whenever JavaScript files change
grunt watch
```
