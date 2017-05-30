import Table from './table';
import View from './view';
import listenable from './listenable';

@listenable
export default class Store {
  views = {};

  constructor(options) {
    this.tables = options.tables;

    Object.keys(options.tables).forEach(table => {
      this[table] = new Table(this, options.tables[table]);
    });
  }

  view(...args) {
    const name = JSON.stringify(args.join('-'));

    if (!this.views[name]) {
      this.views[name] = new View(this);
    }

    return this.views[name]
  }
}
