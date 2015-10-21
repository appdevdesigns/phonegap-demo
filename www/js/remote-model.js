'use strict';

import Model from './model';
import Comm from './comm';

export default Model.extend('RemoteModel', {
  install() {
    // Remote models need no installation, so simply return a resolved promise
    return Promise.resolve();
  },

  request({ url, method = 'GET', params }) {
    return Comm.request({
      url: this.url + url,
      method,
      params,
    });
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
    });
  },

  update(id, params) {
    return this.request({
      url: `/${id}`,
      method: 'PUT',
      params,
    }).then(model => model || null);
  },

  destroy(id, params) {
    return this.request({
      url: `/${id}`,
      method: 'DELETE',
    });
  },
}, {});
