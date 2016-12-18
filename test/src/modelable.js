import { model } from '../../src';

describe('modelable', () => {
  describe('#set', () => {
    it('sets values correctly', () => {
      @model class A {}
      const instance = new A;
      instance.set({ a: 1, b: 2 });
      expect(instance.a).to.eq(1);
      expect(instance.b).to.eq(2);
    });

    it('triggers the context', () => {
      @model class A {}
      const instance = new (A.context('a', 'b'));
      const spy = sinon.spy();
      A.context('a','b').listen(spy);
      instance.set({ b: 2 });
      expect(spy.calledOnce).to.be.true;
    });
  });
});
