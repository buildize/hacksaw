import { createStore, store } from '../../src';

describe('createStore', () => {
  it ('assign methods correctly', () => {
    const Store = createStore({
      get getter() {
        return 'val';
      },

      fetch() {
        return this.getter;
      },

      async asyncMethod() {
        return 'im async';
      }
    });

    expect(Store.getter).to.eq('val');
    expect(Store.fetch()).to.eq('val');
    Store.asyncMethod().then(val => {
      expect(val).to.eq('im async');
    });
  });

  it ('assign store methods correctly', () => {
    const Store = createStore();
    Store.put({ id: 1, name: 'hello' });

    expect(Store.context('a')).to.eq(Store.context('a'));
    expect(Store.first.name).to.eq('hello');
  });
});
