import table from './decorators/table';
import listener from './decorators/listener';
import isArray from 'lodash/isArray';
import values from 'lodash/values';

const defaultConfig = { key: 'id', relations: {} };

@table
@listener
class Table {
  data = {};

  constructor(store, name, config) {
    this.store = store;
    this.name = name;
    this.config = Object.assign({}, defaultConfig, config);
  }

  put(objects) {
    if (!isArray(objects)) return this.put([objects])[0];
    const result = objects.map(::this.__put);
    this.trigger(result.map(item => item[this.config.key]));
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

  clean() {
    this.data = {};
    this.trigger(null, 'clean');
  }

  remove(keys) {
    if (!isArray(keys)) return this.remove([keys]);

    keys.forEach(key => {
      delete(this.data[key]);
    });

    this.trigger(keys, 'remove');
  }

  get all() {
    return values(this.data);
  }
}

export default Table;
