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

describe('Store.export and Store.import', () => {
  let store;

  before(() => store = createStore({
    tables: {
      a: {
        relations: {
          relatedObject: {
            type: Object,
            table: 'c'
          }
        }
      },
      b: {},
      c: {}
    }
  }));

  it('export all the tables and views as JSON', () => {
    store.a.put({ id: 2, name: 'name2', relatedObject: { id: 1, name: 'namec' } });
    store.a.put({ id: 1, name: 'name1' });
    store.b.put({ id: 1, name: 'name1b' });
    store.view('test').a.put([{ id: 1 }, { id: 2 }]);
    store.view('test').b.put({ id: 1 });
    store.view('test2').b.put({ id: 1 });

    const result = {
      tables: {
        a: {
          data: {
            '1': { id: 1, name: 'name1' },
            '2': {
              id: 2,
              name: 'name2',
              relatedObject: {
                id: 1,
                name: 'namec'
              }
            }
          },
          keys: [2, 1]
        },
        b: {
          data: {
            '1': { id: 1, name: 'name1b' }
          },
          keys: [1]
        },
        c: {
          data: {
            '1': { id: 1, name: 'namec' }
          },
          keys: [1]
        }
      },
      views: {
        test: {
          a: [1, 2],
          b: [1],
          c: [1]
        },
        test2: {
          a: [],
          b: [1],
          c: []
        }
      }
    }

    expect(store.export()).to.eql(JSON.stringify(result));

    const exported = store.export();
    store.clean();
    store.import(exported);

    expect(store.c.first).to.eql({ id: 1, name: 'namec' });
    expect(store.a.first.relatedObject).to.eql(store.c.first);
    expect(store.view('test2').b.first.id).to.eq(1);
  });
});
