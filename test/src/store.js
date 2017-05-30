import { createStore } from '../../src';
import Store from '../../src/store';
import View from '../../src/view';

describe('Store#base', () => {
  it('includes listenable', () => {
    commonTests.implementsListener(Store);
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
