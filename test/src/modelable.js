import { store } from '../../src';

describe('modelable', () => {
  describe('.set', () => {
    it ('sets context values correctly', () => {
      @store class A {}
      A.set({ b: 1 });
      A.context('hello').set({ d: 2 });
      expect(A.b).to.eq(1);
      expect(A.context('hello').d).to.eq(2);
    });

    it ('triggers with all parent contexts', () => {
      @store class A {}
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      A.listen(spy1);
      A.context('test').listen(spy2);
      A.context('test').set({ wow: true });

      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });

    it ('returns itself', () => {
      @store class A {}
      expect(A.context('a').set({})).to.eq(A.context('a'));
    });
  });
});
