import ViewTable from './view-table';
import listener from './decorators/listener';
import store from './decorators/store';

@listener
@store
export default class View {
  constructor(store) {
    Object.keys(store.tables).forEach(table => {
      this[table] = new ViewTable(store[table]);
      this[table].listen(::this.trigger);
    });
  }
}
