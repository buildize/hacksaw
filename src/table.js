import CommonTable from './common-table';
import listenable from './listenable';
import isArray from 'lodash/isArray';
import values from 'lodash/values';

const defaultConfig = { key: 'id', relations: {} };

@listenable
class Table extends CommonTable {
  data = {};

  constructor(store, config) {
    super();
    this.store = store;
    this.config = Object.assign({}, defaultConfig, config);
  }

  put(objects) {
    if (!isArray(objects)) return this.put([objects])[0];
    const result = objects.map(::this.__put);
    this.trigger();
    return result;
  }

  __put(object) {
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

export default Table;
