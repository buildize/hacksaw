import Table from './table';
import View from './view';
import listener from './decorators/listener';
import store from './decorators/store';
import values from 'lodash/values';
import isString from 'lodash/isString';

@listener
@store
export default class Store {
  views = {};

  constructor(options) {
    this.tables = options.tables;

    Object.keys(options.tables).forEach(table => {
      this[table] = new Table(this, table, options.tables[table]);
      this[table].listen(::this.trigger);
    });
  }

  view(...args) {
    const name = args.map(arg => isString(arg) ? arg : JSON.stringify(arg)).join('-');

    if (!this.views[name]) {
      this.views[name] = new View(this);
      this.views[name].name = name;
    }

    return this.views[name]
  }

  clean() {
    Object.keys(this.tables).forEach(tableName => {
      this[tableName].clean();
    });
  }

  export() {
    const result = {
      tables: {},
      views: {}
    };

    Object.keys(this.views).forEach(viewName => {
      result.views[viewName] = {};

      Object.keys(this.tables).forEach(tableName => {
        result.views[viewName][tableName] = this.views[viewName][tableName].keys;
      });
    });

    Object.keys(this.tables).forEach(tableName => {
      result.tables[tableName] = {
        data: this[tableName].data,
        keys: this[tableName].keys
      };
    });

    return JSON.stringify(result);
  }

  import(data) {
    data = JSON.parse(data);

    Object.keys(data.tables).forEach(tableName => {
      this[tableName].put(values(data.tables[tableName].data));
      this[tableName].keys = data.tables[tableName].keys;
    });

    Object.keys(data.views).forEach(viewName => {
      Object.keys(data.views[viewName]).forEach(tableName => {
        this.view(viewName)[tableName].keys = data.views[viewName][tableName];
      });
    });
  }
}
