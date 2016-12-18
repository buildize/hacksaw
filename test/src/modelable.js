import { model } from '../../src';

describe('modelable', () => {
  describe('.set', () => {
    it ('sets context values correctly', () => {
      @model class A {}
      A.set({ b: 1 });
      A.context('hello').set({ d: 2 });
      expect(A.b).to.eq(1);
      expect(A.context('hello').d).to.eq(2);
    });

    it ('triggers with all parent contexts', () => {
      @model class A {}
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      A.listen(spy1);
      A.context('test').listen(spy2);
      A.context('test').set({ wow: true });

      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });

    it ('returns itself', () => {
      @model class A {}
      expect(A.context('a').set({})).to.eq(A.context('a'));
    });
  });

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

  describe('#getSetter', () => {
    @model class A {}

    it('sets value correctly', () => {
      const instance = new A();
      instance.getSetter('name')('hello');
      expect(instance.name).to.eq('hello');
    });

    it('sets deeply', () => {
      const instance = new A();
      instance.items = [{}, { others: [{}, {}], another: {} }];

      instance.getSetter('items', 0, 'name')('test');
      instance.getSetter('items', 1, 'others', 1, 'number')(15);
      instance.getSetter('items', 1, 'another', 'array')([1,2,3]);

      expect(instance.items[0].name).to.eq('test');
      expect(instance.items[1].others[1].number).to.eq(15);
      expect(instance.items[1].another.array).to.eql([1,2,3]);
    });

    it('triggers the context', () => {
      const instance = new (A.context('a', 'b'));
      const spy = sinon.spy();
      A.context('a').listen(spy);
      instance.getSetter('b')(2);
      expect(spy.calledOnce).to.be.true;
    });
  });
});
