import { createStore } from '../../src';
import Store from '../../src/store';
import View from '../../src/view';

describe('Store#base', () => {
  it('includes listener decorator', () => {
    commonTests.implementsListener(Store);
  });

  it('includes store decorator', () => {
    commonTests.implementsStore(Store);
  });

  it('triggers on table changes', () => {
    const store = createStore({ tables: { products: {}, users: {} } });
    const fn = sinon.spy();
    store.listen(fn);
    store.products.put({ id: 1 });
    store.users.put({ id: 2 });
    store.products.clean();
    expect(fn.callCount).to.eq(3);
  });
});

describe('Store.view', () => {
  let store;

  before(() => store = createStore());

  it('returns View instance', () => {
    const storeView = store.view('login');
    expect(storeView.constructor).to.eq(View);
  });

  it('returns the same object', () => {
    const storeView1 = store.view('login');
    const storeView2 = store.view('login');
    expect(storeView1).to.eq(storeView2);
  });
});
