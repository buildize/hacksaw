import ViewTable from './view-table';

export default class View {
  constructor(store) {
    Object.keys(store.tables).forEach(table => {
      this[table] = new ViewTable(store[table]);
    });
  }
}
