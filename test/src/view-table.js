import { createStore } from '../../src';

describe('ViewTable.put', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it('puts objects correctly into main table', () => {
    const data = { id: 1, name: 'test' };
    store.view('test').products.put(data);
    expect(store.products.all).to.eql([data]);
  });
});

describe('ViewTable.all', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it('returns only the view items', () => {
    const view = store.view('test');
    const data = { id: 1, name: 'test' };
    store.products.put({ id: 2, name: 'test2' });
    view.products.put(data);

    expect(view.products.all).to.eql([data]);
  });
});

describe('ViewTable.first, ViewTable.last', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it('returns the first and last item', () => {
    const view = store.view('test');
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    view.products.put(data);

    expect(view.products.first).to.eql({ id: 1 });
    expect(view.products.last).to.eql({ id: 3 });
  });
});
