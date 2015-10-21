'use strict';

import can from 'can';

export default can.Model.extend('Model', {}, {
  // Return this model instance's primary key
  getId() {
    return this.attr(this.constructor.id);
  },
});
