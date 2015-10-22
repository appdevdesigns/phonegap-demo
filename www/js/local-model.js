'use strict';

import Model from './model';
import db from './db';

export default Model.extend('LocalModel', {
  install(success, error) {
    // Install this model in the database
    return db.install(this.getTableData()).done(success).fail(error);
  },

  findAll(params, success, error) {
    // Mark the found models as present in the database
    return db.find(this.getTableData(), params).done(models => {
      models.forEach(model => model.isSaved = true);
    }).done(success).fail(error);
  },

  findOne(params, success, error) {
    // Mark the found model as present in the database
    return db.find(this.getTableData(), params).then(rows => rows[0] || null).done(model => {
      if (model) {
        model.isSaved = true;
      }
    }).done(success).fail(error);
  },

  create(params, success, error) {
    const primaryKey = this.id;
    return db.create(this.getTableData(), params).then(insertId => {
      // The object returned here will augment the model's attributes
      const obj = {};

      // If the model did not have an explicit primary key, record the generated one
      if (typeof params[primaryKey] === 'undefined') {
        obj[primaryKey] = insertId;
      }

      return obj;
    }).done(success).fail(error);
  },

  update(id, params, success, error) {
    return db.update(this.getTableData(), id, params).done(success).fail(error);
  },

  destroy(id, params, success, error) {
    return db.destroy(this.getTableData(), id).done(success).fail(error);
  },

  getTableData() {
    return {
      name: this._fullName,
      primaryKey: this.id,
      attributes: this.attributes,
    };
  },
}, {});
