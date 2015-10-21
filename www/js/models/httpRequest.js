'use strict';

import LocalModel from '../local-model';

const HTTPRequest = LocalModel.extend('HTTPRequest', {
  id: 'requestId',
  attributes: {
    requestId: 'int|primarykey|autoincrement|unique',
    options: 'string',
  },
  defaults: {
    options: {},
  },
}, {
  define: {
    // The "options" attribute is JSON data, but should
    // be serialized in the database as a string
    options: {
      // Convert the options attribute into its serialized form
      serialize(value) {
        return JSON.stringify(value);
      },

      // Convert the options attribute from its serialized form
      type(raw) {
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw);
          } catch (e) {
            return {};
          }
        }

        return raw;
      },
    },
  },
});

export default HTTPRequest;
