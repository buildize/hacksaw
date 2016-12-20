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

    it ('stores keys', () => {
      @store class A {}
      const instance = new A;
      instance.set({ a: 1, b: 2 });
      expect(instance.__keys).to.eql({ a: true, b: true });
    });
  });

  describe('#set', () => {
    it('sets values correctly', () => {
      @store class A {}
      const instance = new A;
      instance.set({ a: 1, b: 2 });
      expect(instance.a).to.eq(1);
      expect(instance.b).to.eq(2);
    });

    it('triggers the context', () => {
      @store class A {}
      const instance = new (A.context('a', 'b'));
      const spy = sinon.spy();
      A.context('a','b').listen(spy);
      instance.set({ b: 2 });
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('#getSetter', () => {
    @store class A {}

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

    it ('stores keys', () => {
      @store class A {}
      const instance = new A;
      instance.getSetter('c')('u');
      expect(instance.__keys).to.eql({ c: true });
    });
  });

  describe('#toObject', () => {
    it ('serialize only set keys', () => {
      @store class A {}
      const instance = new A;
      instance.set({ a: 1, b: 2 });
      instance.c = 4;
      expect(instance.toObject()).to.eql({ a: 1, b: 2 });
    });
  });

  describe('.toArray', () => {
    it ('returns array correctly', () => {
      @store class A {}
      A.put({ id: 1, name: 'name1' });
      A.put({ id: 2, name: 'name2' });

      expect(A.toArray()).to.eql([
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' }
      ]);
    });
  });
});
