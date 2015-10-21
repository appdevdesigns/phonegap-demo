'use strict';

import $ from 'jquery';
import Model from './model';

const server = 'http://173.16.6.59:1337';

export default Model.extend('RemoteModel', {
  install() {
    // Remote models need no installation, so simply return a resolved promise
    return Promise.resolve();
  },

  request({ url, method = 'GET', params }) {
    return $.ajax({
      url: `${server}/${this.url}${url}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.data);
  },

  findAll(params, success, error) {
    return this.request({
      url: '',
      params,
    }).done(success).fail(error);
  },

  findOne(params, success, error) {
    const id = params[this.id];
    return this.request({
      url: `/${id}`,
    }).then(model => model || null).done(success).fail(error);
  },

  create(params, success, error) {
    return this.request({
      url: '',
      method: 'POST',
      params,
    }).done(success).fail(error);
  },

  update(id, params, success, error) {
    return this.request({
      url: `/${id}`,
      method: 'PUT',
      params,
    }).then(model => model || null).done(success).fail(error);
  },

  destroy(id, params, success, error) {
    return this.request({
      url: `/${id}`,
      method: 'DELETE',
    }).done(success).fail(error);
  },
}, {});
