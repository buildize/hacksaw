import storeable from '../../src/storeable';
import listenable from '../../src/listenable';
import contextable from '../../src/contextable';
import uuid from 'uuid/v4';

describe('storeable', () => {
  describe('.all', () => {
    it ('stores different array for every child classes', () => {
      @storeable class A {}
      class B extends A {}

      expect(A.all).to.not.eq(B.all);
    });
  });

  describe('.first, .last', () => {
    it ('returns first and last object of the store', () => {
      @storeable class A {}
      const instance1 = A.put({ id: 1 });
      const instance2 = A.put({ id: 2 });

      expect(A.first).to.eq(instance1);
      expect(A.last).to.eq(instance2);
    })
  });

  describe('.clean', () => {
    it ('cleans store correctly', () => {
      @storeable class A {}
      A.put({ id: 1 });
      A.put({ id: 2 });
      A.clean();

      expect(A.all.length).to.eq(0);
    });

    it ('returns class', () => {
      @storeable class A {}
      expect(A.clean()).to.eq(A);
    });

    it ('triggers callbacks', () => {
      @storeable @listenable class A {}
      const spy = sinon.spy();
      A.listen(spy).clean();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('.populate', () => {
    it ('not populate if store is not empty', () => {
      @storeable class A {}
      class B extends A { static parent = A }
      A.put({ id: 1 });
      B.put({ id: 2 });
      B.populate(i => i.id === 1);
      expect(B.all.length).to.eq(1);
      expect(B.first.id).to.eq(2);
    });

    it ('populates correctly', () => {
      @contextable @storeable class A {}
      class B extends A { static parent = A }
      class C extends B { static parent = B }
      A.put({ id: 0 });
      const instance = A.put({ id: 1 });
      C.populate(i => i.id === 1);

      expect(C.all).to.eql([instance]);
      expect(C.populate(i => i.id)).to.eq(C);
      expect(B.populate(i => i.id)).to.eq(B);
    });
  });

  describe('.put', () => {
    it ('not duplicate items', () => {
      @storeable class A {}

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

    it ('puts new instances if argument is plain object', () => {
      @storeable class A {}
      A.put({ id: 1, name: 'test' });
      expect(A.all[0].constructor).to.eq(A);
    });

    it ('returns items back', () => {
      @storeable class A {}
      expect(A.put({ id: 1 }).id).to.eq(1);
      expect(A.put([{ id: 1 }])[0].id).to.eq(1);
    });

    it ('overrides by first key', () => {
      @storeable class A {
        static keys = ['id', 'uuid'];
        uuid = uuid();
      }

      const instance1 = A.put({ id: 15 });
      const instance2 = A.put({ id: 15 });
      const instance3 = A.put({ uuid: instance2.uuid });

      expect(instance1).to.eq(instance2);
      expect(instance2).to.eq(instance3);
    });

    it ('updates parent items', () => {
      @storeable class A {}
      class B extends A { static parent = A; }

      const instance1 = A.put({ id: 1 });
      const instance2 = B.put({ id: 2 });
      const instance3 = B.put({ id: 1 });

      expect(A.all).to.eql([instance1, instance2]);
      expect(B.all).to.eql([instance2, instance1]);
      expect(instance1).to.eq(instance3);
    });

    it ('triggers listeners', () => {
      @storeable @listenable class A {}
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