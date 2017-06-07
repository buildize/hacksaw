import table from './decorators/table';
import listener from './decorators/listener';
import isArray from 'lodash/isArray';
import values from 'lodash/values';
import cloneDeep from 'lodash/cloneDeep';

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

  put(objects, replace = false) {
    if (!isArray(objects)) return this.put([objects], replace)[0];
    const result = objects.map(item => this.__put(item, replace));
    this.trigger(result.map(item => item[this.config.key]));
    return result;
  }

  __put(object, replace) {
    const key = object[this.config.key];
    if (replace) this.data[key] = {};
    this.data[key] = cloneDeep(Object.assign({}, this.data[key], object));

    Object.keys(this.config.relations).forEach(relationKey => {
      const relation = this.config.relations[relationKey];

      if (this.data[key][relationKey]) {
        this.data[key][relationKey] = this.store[relation.table].put(this.data[key][relationKey]);
      }
    });

    return this.data[key];
  }

  replace(objects) {
    return this.put(objects, true);
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
    return cloneDeep(values(this.data));
  }
}

export default Table;
