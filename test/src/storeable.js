import { store } from '../../src';
import uuid from 'uuid/v4';

describe('storeable', () => {
  describe('.all', () => {
    it ('stores different array for every child classes', () => {
      @store class A {}
      class B extends A {}

      expect(A.all).to.not.eq(B.all);
    });
  });

  describe('.first, .last', () => {
    it ('returns first and last object of the store', () => {
      @store class A {}
      const instance1 = A.put({ id: 1 });
      const instance2 = A.put({ id: 2 });

      expect(A.first).to.eq(instance1);
      expect(A.last).to.eq(instance2);
    })
  });

  describe('.clean', () => {
    it ('cleans store correctly', () => {
      @store class A {}
      A.put({ id: 1 });
      A.put({ id: 2 });
      A.clean();

      expect(A.all.length).to.eq(0);
    });

    it ('returns class', () => {
      @store class A {}
      expect(A.clean()).to.eq(A);
    });

    it ('triggers callbacks', () => {
      @store class A {}
      const spy = sinon.spy();
      A.listen(spy).clean();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('.populate', () => {
    it ('populates correctly', () => {
      @store class A {}
      class B extends A { static parent = A }
      class C extends B { static parent = B }
      A.put({ id: 0 });
      const instance = A.put({ id: 1 });
      C.populate(i => i.id === 1);

      expect(C.all).to.eql([instance]);
      expect(B.populate(i => i.id)).to.eq(B);
    });
  });

  describe('.clone', () => {
    it ('clones correctly', () => {
      @store class A {}
      class B extends A { static parent = A }
      class C extends B { static parent = B }
      A.put({ id: 0 });
      const instance = A.put({ id: 1 });
      C.clone(i => i.id === 1);

      expect(C.all.length).to.eq(1);
      expect(C.all[0].id).to.eq(instance.id);
      expect(C.all[0]).to.not.eq(instance);
      expect(B.clone(i => i.id)).to.eq(B);
    });
  });

  describe('.put', () => {
    it ('not duplicate items', () => {
      @store class A {}

      const instance1 = new A();
      instance1.id = 1;

      const instance2 = new A();
      instance2.id = 1;

      const instance3 = new A();
      instance3.id = 2;

      A.put([instance1,instance3]);
      A.put(instance2);

      expect(A.all.map(i => i.id)).to.eql([1, 2]);
    });

    it ('returns items back', () => {
      @store class A {}
      expect(A.put({ id: 1 }).id).to.eq(1);
      expect(A.put([{ id: 1 }])[0].id).to.eq(1);
    });

    it ('use getKey method if it exists', () => {
      @store class A {
        static getKey(object) {
          return object.oid;
        }
      }

      const instance1 = A.put({ id: 1, oid: 1 });
      const instance2 = A.put({ id: 1, oid: 2 });
      const instance3 = A.put({ id: 1, oid: 3 });
      const instance4 = A.put({ id: 3, oid: 3 });

      expect(instance1).to.not.eq(instance2);
      expect(instance3).to.eq(instance4);
      expect(instance4.id).to.eq(3);
    });

    it ('updates parent items', () => {
      @store class A {}
      class B extends A { static parent = A; }

      const instance1 = A.put({ id: 1 });
      const instance2 = B.put({ id: 2 });
      const instance3 = B.put({ id: 1 });

      expect(A.all).to.eql([instance1, instance2]);
      expect(B.all).to.eql([instance2, instance1]);
      expect(instance1).to.eq(instance3);
    });

    it ('triggers listeners', () => {
      @store class A {}
      class B extends A { static parent = A }
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      A.listen(spy1);
      B.listen(spy2);

      B.put({ id: 1 });
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });
  });
});
