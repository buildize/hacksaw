import { createStore } from '../../src';
import Store from '../../src/store';

describe('createStore', () => {
  it('creates a new store', () => {
    expect(createStore().constructor).to.eq(Store);
  });
});
