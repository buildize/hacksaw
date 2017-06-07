import Table from './table';
import View from './view';
import listener from './decorators/listener';
import store from './decorators/store';

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
    const name = args.map(JSON.stringify).join('-');

    if (!this.views[name]) {
      this.views[name] = new View(this);
    }

    return this.views[name]
  }

  clean() {
    Object.keys(this.tables).forEach(tableName => {
      this[tableName].clean();
    });
  }
}
