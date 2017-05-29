import CommonTable from './common-table';
import isArray from 'lodash/isArray';
import values from 'lodash/values';

const defaultConfig = { key: 'id', relations: {} };

export default class Table extends CommonTable {
  data = {};

  constructor(store, config) {
    super();
    this.store = store;
    this.config = Object.assign({}, defaultConfig, config);
  }

  put(object) {
    if (isArray(object)) return object.map(item => this.put(item));

    const key = object[this.config.key];
    this.data[key] = Object.assign({}, this.data[key], object);

    Object.keys(this.config.relations).forEach(relationKey => {
      const relation = this.config.relations[relationKey];

      if (this.data[key][relationKey]) {
        this.data[key][relationKey] = this.store[relation.table].put(this.data[key][relationKey]);
      }
    });

    return this.data[key];
  }

  get all() {
    return values(this.data);
  }
}
