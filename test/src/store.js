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

  it('allows objects as argument', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    expect(store.view('view', obj1)).to.not.eq(store.view('view', obj2));
  });
});

describe('Store.clean', () => {
  let store;

  before(() => store = createStore({ tables: { a: {}, b: {} } }));

  it('cleans the store', () => {
    store.a.put({ id: 1 });
    store.b.put({ id: 2 });
    store.set({ key: 'val' });
    store.clean();

    expect(store.a.all.length).to.eq(0);
    expect(store.b.all.length).to.eq(0);
    expect(store.key).not.to.eq('val');
  });
});
