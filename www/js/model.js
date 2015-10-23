'use strict';

// Load the CanJS and the required plugins
import can from 'can';
import 'can/map/define';

// Instantiate a new ChanceJS generator instance for generating UUIDs
import Chance from 'chance';
const chance = new Chance();

export default can.Model.extend('Model', {
  extend(name, staticProps, protoProps) {
    // Ignore the isSaved property when serializing
    can.extend(true, protoProps, {
      define: {
        isSaved: {
          serialize: false,
        },
      },
    });

    const Model = this._super(...arguments);

    if (Model.hasUuid) {
      // For models with a UUID field, the primary key defaults to an automatically generated UUID
      Object.defineProperty(Model.defaults, Model.id, {
        get() {
          // Generate a new UUID
          return chance.guid();
        },

        enumerable: true,
      });
    }

    return Model;
  },
}, {
  // Return this model instance's primary key
  getId() {
    return this.attr(this.constructor.id);
  },

  isSaved: false,

  save() {
    // Call the original "save" function
    return this._super(this, ...arguments).done(() => {
      // Mark this model as present in the database
      this.isSaved = true;
    });
  },

  // Override the built-in can.Model#isNew with more intelligent functionality
  // The original isNew function determines whether or not a model is already present in the
  // database by checking whether its primary key is set. That heuristic is not appropriate for
  // this application because the primary key occasionally needs to be set explicitly rather than
  // automatically calculated via AUTOINCREMENT. Instead, we set a boolean "isSaved" flag to true
  // on every model read from the database via findOne and findAll. Also, calls to "save" also set
  // this flag to true. "isNew" then calculates whether the model has been saved or not by simply
  // checking the "isSaved" flag.
  isNew() {
    return !this.isSaved;
  },
});
