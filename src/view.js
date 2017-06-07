import ViewTable from './view-table';
import listener from './decorators/listener';
import store from './decorators/store';

@listener
@store
export default class View {
  constructor(store) {
    this.store = store;

    Object.keys(store.tables).forEach(table => {
      this[table] = new ViewTable(this, store[table]);
      this[table].listen(::this.trigger);
    });
  }

  clean() {
    Object.keys(this.store.tables).forEach(tableName => {
      this[tableName].clean();
    });
  }
}
