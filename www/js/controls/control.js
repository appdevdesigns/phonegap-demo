'use strict';

/*
 * The Control class extends the can.Control class and adds functionality to
 * all controls in the application. All controls should derive from Control
 * or from one of its derived classes.
 */

import can from 'can';

export default can.Control.extend({
  // The unique id of the template used to render the control
  // It should always be overriden in derived controls
  template: null,

  init() {
    this.controlId = this.prototype.controlId = can.hyphenate(this.fullName).toLowerCase();
  },
}, {
  init(element, options) {
    // The app may have passed in a reference to itself
    if (options.app) {
        this.app = options.app;
    }
    // This data will be available to the template
    this.scope = new can.Map();

    // Call the can.Control constructor
    return this._super(...arguments);
  },

  /*
   * Render the control and insert it into the control's DOM element
   */
  render() {
    // Pass this.scope Map as the template data
    const fragment = can.view(this.constructor.template, this.scope);
    this.element.html(fragment);
  },
});
