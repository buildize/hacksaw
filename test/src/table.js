import { createStore } from '../../src';
import Table from '../../src/table';

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
  it ('returns the first and last item', () => {
    const table = new Table();
    table.put([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(table.first).to.eql({ id: 1 });
    expect(table.last).to.eql({ id: 3 });
  });
});
