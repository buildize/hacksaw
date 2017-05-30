import { createStore } from '../../src';
import ViewTable from '../../src/view-table';

describe('ViewTable#base', () => {
  it('includes listenable', () => {
    commonTests.implementsListener(ViewTable);
  });
});

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

  it('triggers the listeners', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const view = store.view('test');
    const fn = sinon.spy();
    view.products.listen(fn);
    view.products.put(data);
    expect(fn.callCount).to.eq(1);
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

describe('ViewTable.clean', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it('cleans all the data', () => {
    const view = store.view('test');
    view.products.put({ id: 1 });
    view.products.clean();
    expect(view.products.all).to.eql([]);
  });

  it('triggers the listeners', () => {
    const view = store.view('test');
    const fn = sinon.spy();
    view.products.listen(fn);
    view.products.clean();
    expect(fn.calledOnce).to.be.true;
  });
});
