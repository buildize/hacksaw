import { createStore } from '../../src';
import View from '../../src/view';
import ViewTable from '../../src/view-table';

describe('View#base', () => {
  it('includes listener', () => {
    commonTests.implementsListener(View);
  });

  it('includes store decorator', () => {
    commonTests.implementsStore(View);
  });

  it('triggers on table changes', () => {
    const store = createStore({ tables: { products: {}, users: {} } });
    const view = store.view('test');
    const fn = sinon.spy();
    view.listen(fn);
    view.products.put({ id: 1 });
    view.users.put({ id: 2 });
    view.products.clean();
    expect(fn.callCount).to.eq(3);
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

describe('View.clean', () => {
  let store;

  before(() => store = createStore({ tables: { a: {}, b: {} } }));

  it('cleans the store', () => {
    const view = store.view('clean-test');

    view.a.put({ id: 1 });
    view.b.put({ id: 2 });
    view.set({ key: 'val' });
    view.clean();

    expect(view.a.all.length).to.eq(0);
    expect(view.b.all.length).to.eq(0);
    expect(view.key).not.to.eq('val');
  });
});
