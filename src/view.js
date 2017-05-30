import ViewTable from './view-table';
import listenable from './listenable';

@listenable
export default class View {
  constructor(store) {
    Object.keys(store.tables).forEach(table => {
      this[table] = new ViewTable(store[table]);
    });
  }
}
