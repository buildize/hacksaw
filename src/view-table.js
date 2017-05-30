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

  put(object) {
    if (isArray(object)) return object.map(item => this.put(item));

    const result = this.table.put(object);
    const key = result[this.table.config.key];
    if (!this.keys.includes(key)) this.keys.push(key);

    return result;
  }

  get all() {
    return this.keys.map(key => this.table.data[key]);
  }
}
