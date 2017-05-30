import { createStore } from '../../src';
import Table from '../../src/table';

describe('Table#base', () => {
  it('includes listenable', () => {
    commonTests.implementsListener(Table);
  });
});

describe('Table.put', () => {
  let table;

  describe('basics', () => {
    before(() => table = new Table());

    it('puts objects correctly', () => {
      const data = { id: 12, name: 'Phone' };
      table.put(data);
      expect(table.data[12]).to.eql(data);
    });

    it('returns the object reference', () => {
      const result = table.put({ id: 1 });
      expect(result).to.eq(table.data[1]);
    });

    it('can put array and returns array', () => {
      const data = [{ id: 1, name: 'Phone' }, { id: 2, name: 'Pencil' }];
      const result = table.put(data);
      expect(result).to.eql(data);
    });

    it('triggers callbacks correctly', () => {
      const data = [{ id: 1, name: 'Phone' }, { id: 2, name: 'Pencil' }];
      const fn = sinon.spy();
      table.listen(fn)
      table.put(data);
      table.put({ id: 3 });
      expect(fn.calledTwice).to.be.true;
    });
  });

  describe('relations', () => {
    let store;

    before(() => {
      store = createStore({
        tables: {
          products: {
            relations: {
              comments: {
                type: Array,
                table: 'comments'
              },
              user: {
                type: Object,
                table: 'users'
              }
            }
          },
          users: {},
          comments: {}
        }
      });
    });

    it("puts relations correctly", () => {
      const data = {
        id: 1,
        name: 'Boat',
        comments: [
          { id: 1, content: 'good' },
          { id: 2, content: 'nice' }
        ],
        user: {
          id: 5,
          name: 'Albert'
        }
      };

      store.products.put(data);
      expect(store.products.all[0].comments[0]).to.eq(store.comments.all[0]);
    });
  });
});

describe('Table.all', () => {
  let table;

  before(() => table = new Table());

  it('returns all the data', () => {
    const data = [
      { id: 1, name: 'Phone' },
      { id: 2, name: 'Phone 2' },
      { id: 3, name: 'Phone 3' }
    ];

    table.put(data);

    expect(table.all).to.eql(data);
  });
});

describe('Table.first, Table.last', () => {
  it('returns the first and last item', () => {
    const table = new Table();
    table.put([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(table.first).to.eql({ id: 1 });
    expect(table.last).to.eql({ id: 3 });
  });
});

describe('Table.clean', () => {
  it('cleans all the data', () => {
    const table = new Table({ views: {} });
    table.put({ id: 1 }, { id: 2 });
    table.clean();
    expect(table.all.length).to.eq(0);
  });

  it('cleans all view tables data', () => {
    const store = createStore({ tables: { products: {} } });
    store.view('test').products.put({ id: 1 });
    store.view('test2').products.put({ id: 2 });
    store.products.clean();
    expect(store.view('test').products.all.length).to.eq(0);
    expect(store.view('test2').products.all.length).to.eq(0);
  });
});

describe('Table.remove', () => {
  let store;

  before(() => store = createStore({ tables: { products: {} } }))

  it('removes items correctly', () => {
    store.products.put([{ id: 1 }, { id: 2 }]);
    store.products.remove(1);
    expect(store.products.all).to.eql([{ id: 2 }]);
  });

  it('triggers listeners', () => {
    const fn = sinon.spy();
    store.products.put([{ id: 1 }, { id: 2 }, { id: 3 }]);
    store.listen(fn);
    store.products.remove(1);
    store.products.remove([2, 3]);
    expect(fn.callCount).to.eq(2);
  });

  it('removes view items', () => {
    const view1 = store.view('test1');
    const view2 = store.view('test2');
    view1.products.put([{ id: 1 }, { id: 2 }]);
    view2.products.put({ id: 1 });
    store.products.remove(1);
    expect(view1.products.all).to.eql([{ id: 2 }]);
    expect(view2.products.all).to.eql([]);
  });
});
