import { createStore } from '../../src';
import ViewTable from '../../src/view-table';

describe('ViewTable#base', () => {
  it('includes listenable', () => {
    commonTests.implementsListener(ViewTable);
  });

  it('triggers if main data change', () => {
    const store = createStore({ tables: { products: {} } });
    const view1 = store.view('test1');
    const view2 = store.view('test2');
    const fn = sinon.spy();

    view1.products.put({ id: 1 });
    view1.listen(fn);

    view2.products.put({ id: 1, name: 'the name' });
    expect(fn.calledOnce).to.be.true;
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

  it('puts object to the view by relations', () => {
    store = createStore({
      tables: {
        products: {
          relations: {
            users: {
              type: Array,
              table: 'users'
            }
          }
        },
        users: {}
      }
    })

    const data = {
      id: 1,
      users: [{ id: 2 }, { id: 3 }]
    };

    const view = store.view('test');
    view.products.put(data);
    expect(view.products.first.id).to.eq(1);
    expect(view.users.all).to.eql([{ id: 2 }, { id: 3 }]);
  });
});

describe('ViewTable.replace', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it ('replaces all data of items', () => {
    const view = store.view('test');
    view.products.put({ id: 1, name: 'Test', another: 5 });
    view.products.replace({ id: 1, name: 'Hello' });
    expect(view.products.first.another).to.be.undefined;
    expect(view.products.first.name).to.eq('Hello');
  });

  it('not replace relations', () => {
    store = createStore({
      tables: {
        products: {
          relations: {
            users: {
              type: Array,
              table: 'users'
            }
          }
        },
        users: {}
      }
    });

    const view = store.view('test');
    view.products.put({ id: 1, name: 'Test', users: [{ id: 1, name: 'AUser' }] });
    view.products.replace({ id: 1, name: 'Hello', users: [{ id: 1 }, { id: 2 }] });
    expect(view.products.first.users.length).to.eq(2);
    expect(view.products.first.name).to.eq('Hello');
    expect(view.users.first.name).to.eq('AUser');
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

describe('ViewTable.remove', () => {
  let store;

  before(() => {
    store = createStore({ tables: { products: {} } })
  });

  it('triggers the listeners', () => {
    const view = store.view('test');
    const fn = sinon.spy();
    view.products.put([{ id: 1 }]);
    view.products.listen(fn);
    view.products.remove(1);
    expect(fn.calledOnce).to.be.true;
  });
});
