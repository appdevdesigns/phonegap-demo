'use strict';

import Model from './model';
import Comm from './comm';

export default Model.extend('RemoteModel', {
  install() {
    // Remote models need no installation, so simply return a resolved promise
    return Promise.resolve();
  },

  request(options) {
    options.url = this.url + options.url;
    return Comm.request(options);
  },

  findAll(params) {
    return this.request({
      url: '',
      params,
    });
  },

  findOne(params) {
    const id = params[this.id];
    return this.request({
      url: `/${id}`,
    }).then(model => model || null);
  },

  create(params) {
    return this.request({
      url: '',
      method: 'POST',
      params,
      retryFailures: true,
    });
  },

  update(id, params) {
    return this.request({
      url: `/${id}`,
      method: 'PUT',
      params,
      retryFailures: true,
    }).then(model => model || null);
  },

  destroy(id, params) {
    return this.request({
      url: `/${id}`,
      method: 'DELETE',
      retryFailures: true,
    });
  },
}, {});
