import table from './decorators/table';
import listener from './decorators/listener';
import isArray from 'lodash/isArray';

@table
@listener
export default class ViewTable {
  keys = [];

  constructor(table) {
    this.table = table;
  }

  put(objects) {
    if (!isArray(objects)) return this.put([objects])[0];
    const result = objects.map(::this.__put);
    this.trigger();
    return result;
  }

  __put(object) {
    const result = this.table.put(object);
    const key = result[this.table.config.key];
    if (!this.keys.includes(key)) this.keys.push(key);

    return result;
  }

  clean() {
    this.keys = [];
    this.trigger();
  }

  get all() {
    return this.keys.map(key => this.table.data[key]);
  }
}
