import table from './decorators/table';
import listener from './decorators/listener';
import isArray from 'lodash/isArray';
import intersection from 'lodash/intersection';
import cloneDeep from 'lodash/cloneDeep';

@table
@listener
export default class ViewTable {
  keys = [];

  constructor(view, table) {
    this.view = view;
    this.table = table;

    this.table.listen(::this.handleTableChange);
  }

  put(objects, replace = false) {
    if (!isArray(objects)) return this.put([objects], replace)[0];

    objects.forEach(item => {
      const key = item[this.table.config.key];
      if (!this.keys.includes(key)) this.keys.push(key);;
    });

    const results = this.table.put(objects, replace);

    results.forEach(object => {
      Object.keys(this.table.config.relations).forEach(relationKey => {
        const relation = this.table.config.relations[relationKey];

        if (object[relationKey]) {
          this.view[relation.table].put(object[relationKey]);
        }
      });
    });

    return results;
  }

  replace(objects) {
    return this.put(objects, true);
  }

  clean() {
    this.keys = [];
    this.trigger();
  }

  remove(keys, trigger = true) {
    if (!isArray(keys)) return this.remove([keys], trigger);
    this.keys = this.keys.filter(key => !keys.includes(key));
    if (trigger) this.trigger();
  }

  populate(fn) {
    const keys = this.table.all.filter(fn).map(i => i[this.table.config.key]);
    this.keys.push(...keys.filter(i => !this.keys.includes(i)))
  }

  handleTableChange(keys, method) {
    if(intersection(keys, this.keys).length) {
      if (method === 'remove') {
        this.remove(keys, false);
      }

      this.trigger();
    } else if (method === 'clean') {
      this.clean();
    }
  }

  get all() {
    return cloneDeep(this.keys.map(key => this.table.data[key]));
  }
}
