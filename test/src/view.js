import { createStore } from '../../src';
import View from '../../src/view';
import ViewTable from '../../src/view-table';

describe('View#base', () => {
  it('includes listenable', () => {
    commonTests.implementsListener(View);
  });
});

describe('View.constructor', () => {
  it('creates view tables correctly', () => {
    const store = createStore({ tables: { products: {}, users: {} } });
    const view = new View(store);
    expect(view.products.constructor).to.eq(ViewTable);
    expect(view.users.constructor).to.eq(ViewTable);
  });
});
