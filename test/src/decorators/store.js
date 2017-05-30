import store from '../../../src/decorators/store';
import listener from '../../../src/decorators/listener';

@store
@listener
class TestStore {}

describe('store.set', () => {
  it('sets values correctly', () => {
    const store = new TestStore();
    store.set({ a: 1, b: 2 });
    expect(store.a).to.eq(1);
    expect(store.b).to.eq(2);
  });

  it('triggers listeners', () => {
    const store = new TestStore();
    const fn1 = sinon.spy();
    const fn2 = sinon.spy();
    
    store.listen(fn1);
    store.listen(fn2);
    store.set({ a: 1 });

    expect(fn1.calledOnce).to.be.true;
    expect(fn2.calledOnce).to.be.true;
  });
});
