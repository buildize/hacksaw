import { model } from '../../src';

describe('listenable', () => {
  describe('.listen', () => {
    it ('adds callback correctly', () => {
      @model class A {}
      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      A.listen(fn2);

      expect(A.callbacks).to.eql([fn1, fn2]);
    });

    it ('returns the class', () => {
      @model class A {}
      expect(A.listen(() => ({}))).to.eq(A);
    });

    it ('has different callbacks for extended classes', () => {
      @model class A {}
      class B extends A {}

      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      B.listen(fn2);

      expect(A.callbacks).to.eql([fn1]);
      expect(B.callbacks).to.eql([fn2]);
    });
  });

  describe('.unlisten', () => {
    it ('removes listener correctly', () => {
      @model class A {}
      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      A.listen(fn2);
      A.unlisten(fn1);

      expect(A.callbacks).to.eql([fn2]);
    });

    it ('returns the class', () => {
      @model class A {}
      expect(A.unlisten(() => ({}))).to.eq(A);
    });
  });

  describe('.trigger', () => {
    it ('fires callbacks correctly', () => {
      @model class A {}

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      A.listen(spy1);
      A.listen(spy2);

      A.trigger();

      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });

    it ('returns the class', () => {
      @model class A {}
      expect(A.trigger()).to.eq(A);
    });
  });
});
