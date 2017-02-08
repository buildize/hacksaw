import { store } from '../../src';

describe('base', () => {
  //
  // .context method
  //
  describe('.context', () => {
    it ('creates node correctly', () => {
      @store class A {}

      expect(A.context('node1', 'node2').parent).to.eq(A.context('node1'));
      expect(A.context('node1', 'node2', 'node2').parent).to.eq(A.context('node1', 'node2'));
      expect(A.context('node1').parent).to.eq(A);
    });

    it ('returns base class methods correctly', () => {
      @store class A {
        static staticMethod() {
          return 'static';
        }

        instanceMethod() {
          return 'instance';
        }
      }

      const instance = new (A.context('node1', 'node2', 'node3'));

      expect(A.context('node1', 'node2').staticMethod()).to.eq('static');
      expect(instance.instanceMethod()).to.eq('instance');
    });

    it ('accepts object arguments', () => {
      @store class A {}
      expect(A.context('n', { a: 1 })).to.eq(A.context('n', { a: 1 }));
      expect(A.context('n', { a: 1 })).to.not.eq(A.context('n', { a: 2 }));
    })
  });


  //
  // .listen method
  //
  describe('.listen', () => {
    it ('adds callback correctly', () => {
      @store class A {}
      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      A.listen(fn2);

      expect(A.callbacks).to.eql([fn1, fn2]);
    });

    it ('returns the class', () => {
      @store class A {}
      expect(A.listen(() => ({}))).to.eq(A);
    });

    it ('has different callbacks for extended classes', () => {
      @store class A {}

      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      A.context('ctx').listen(fn2);

      expect(A.callbacks).to.eql([fn1]);
      expect(A.context('ctx').callbacks).to.eql([fn2]);
    });
  });


  //
  // .unlisten method
  //
  describe('.unlisten', () => {
    it ('removes listener correctly', () => {
      @store class A {}
      const fn1 = () => ({});
      const fn2 = () => ({});

      A.listen(fn1);
      A.listen(fn2);
      A.unlisten(fn1);

      expect(A.callbacks).to.eql([fn2]);
    });

    it ('returns the class', () => {
      @store class A {}
      expect(A.unlisten(() => ({}))).to.eq(A);
    });
  });

  //
  // .set method
  //
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

  //
  // .put method
  //
  describe('.put', () => {
    it ('not duplicate items', () => {
      @store class A {}

      A.put([{ id: 1 }, { id: 2 }]);
      A.put({ id: 1 });

      expect(A.all.map(i => i.id)).to.eql([1, 2]);
    });

    it ('returns items back', () => {
      @store class A {}
      expect(A.put({ id: 1 }).id).to.eq(1);
      expect(A.put([{ id: 1 }])[0].id).to.eq(1);
    });

    it ('uses getKey method if it exists', () => {
      @store class A {
        static getKey(object) {
          return object.oid;
        }
      }

      const instance1 = A.put({ id: 1, oid: 1 });
      const instance2 = A.put({ id: 1, oid: 2 });
      const instance3 = A.put({ id: 1, oid: 3, other: true });
      const instance4 = A.put({ id: 3, oid: 3 });

      expect(instance1).to.not.eql(instance2);
      expect(instance4.id).to.eq(3);
      expect(instance4.other).to.be.true;
    });

    it ('uses merge method if it exists', () => {
      @store class A {
        static merge(currentItem, nextItem) {
          const obj = {
            ...currentItem,
            ...nextItem
          };

          delete(obj.useless);
          return obj;
        }
      }

      const instance1 = A.put({ id: 1, oid: 1 });
      const instance2 = A.context('hello').put({ id: 1, oid: 2, useless: true, extra: 15 });

      expect(instance1).to.not.eq(instance2);
      expect(instance1.extra).to.undefined;
      expect(instance2.extra).to.eq(15);
      expect(instance2.useless).to.be.undefined;
    });

    it ('updates parent items', () => {
      @store class A {}

      A.put({ id: 1 });
      A.context('cx').put({ id: 2 });
      A.context('cx').put({ id: 1 });

      expect(A.all).to.eql([{ id: 1 }, { id: 2 }]);
      expect(A.context('cx').all).to.eql([{ id: 2 }, { id: 1 }]);
    });

    it ('triggers listeners', () => {
      @store class A {}

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      A.listen(spy1);
      A.context('cx').listen(spy2);

      A.context('cx').put({ id: 1 });
      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });

    it ('triggers all contexts include keys', () => {
      @store class A {}

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();
      const spy4 = sinon.spy();

      A.listen(spy1);
      A.context('cx1').listen(spy2);
      A.context('cx1', 'cx2').listen(spy3);
      A.context('cx3', 'cx4').listen(spy4);

      A.context('cx1', 'cx2').put({ id: 1 });
      A.context('cx3').put({ id: 1 });
      A.context('cx3', 'cx4').put({ id: 2 });

      expect(spy1.calledThrice).to.be.true;
      expect(spy2.calledTwice).to.be.true;
      expect(spy3.calledTwice).to.be.true;
      expect(spy4.calledOnce).to.be.true;
    });
  });



  //
  // .remove method
  //
  describe('.remove', () => {
    it ('removes items on current and child contexts', () => {
      @store class A {}
      A.context('cx1', 'cx2').put({ id: 1, value: true });
      A.context('cx1', 'cx2').put({ id: 2 });
      A.context('cx2').put({ id: 1 });
      A.context('cx1').remove(1);

      expect(A.context('cx1').all).to.eql([{ id: 2 }]);
      expect(A.context('cx1', 'cx2').all).to.eql([{ id: 2 }]);
      expect(A.all).to.eql([{ id: 1, value: true }, { id: 2 }]);
    });

    it ('can remove multiple keys', () => {
      @store class A {}
      A.context('cx1').put([{ id: 1 }, { id: 2 }, { id: 3 }]);
      A.context('cx1').remove([1, 2]);
      expect(A.context('cx1').all).to.eql([{ id: 3 }]);
    });

    it ('triggers context branch with children', () => {
      @store class A {}
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();
      const spy3 = sinon.spy();

      A.context('cx1').listen(spy1);
      A.context('cx1', 'cx2').listen(spy2).put({ id: 1 });
      A.context('cx2').listen(spy3);
      A.context('cx1').remove(1);

      expect(spy1.callCount).to.eq(2);
      expect(spy2.callCount).to.eq(2);
      expect(spy3.callCount).to.eq(0);
    });
  });



  //
  // .replace method
  //
  describe('.remove', () => {
    it('replaces given item with the original item', () => {
      @store class A {}

      A.context('cx1').put({ id: 1, p1: 1, p2: 2 });
      A.context('cx2').replace({ id: 1, p1: 3 });

      expect(A.context('cx1').all).to.eql([{ id: 1, p1: 3 }]);
    });
  });



  //
  // .clean method
  //
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


  //
  // .populate method
  //
  describe('.populate', () => {
    it ('populates correctly', () => {
      @store class A {}

      A.put({ id: 0 });
      A.put({ id: 1 });
      A.put({ id: 2 });
      A.context('cx1').put({ id: 1 });
      A.context('cx1').populate(i => i.id > 0);

      expect(A.context('cx1').all).to.eql([{ id: 1 }, { id: 2 }]);
      expect(A.context('cx2').populate(i => i.id)).to.eq(A.context('cx2'));
    });

    it ('populates correcy order', () => {
      @store class A {}
      A.put([{ id: 1 }, { id: 0 }]);
      const cx = A.context('cx').populate(i => i);

      expect(cx.all).to.eql([{ id: 1 }, { id: 0 }]);
    });
  });


  //
  // .all method
  //
  describe('.all', () => {
    it ('returns all items in the context', () => {
      @store class A {}
      A.put({ id: 1 });
      A.put({ id: 2 });
      A.context('cx').put({ id: 3 });
      A.context('cx').put({ id: 2 });
      expect(A.all).to.eql([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(A.context('cx').all).to.eql([{ id: 3 }, { id: 2 }]);
    });
  });



  //
  // .first, .last method
  //
  describe('.first, .last', () => {
    it ('returns first and last object of the store', () => {
      @store class A {}
      A.put({ id: 1 });
      A.put({ id: 2 });

      expect(A.first).to.eql({ id: 1 });
      expect(A.last).to.eql({ id: 2 });
    });
  });



  //
  // .bind
  //
  describe('.bind', () => {
    it ('triggers bound stores on change', () => {
      @store class ProductStore {}
      @store class UserStore {}

      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      UserStore.listen(spy1);
      ProductStore.listen(spy2);
      UserStore.bind(ProductStore, 'product_id');

      ProductStore.put({ id: 5 });
      UserStore.put({ id: 1, product_id: 5 });
      ProductStore.put({ id: 5, name: 'hello' });
      ProductStore.put({ id: 5, name: 'test' });
      ProductStore.put({ id: 6 });
      UserStore.put({ id: 2, product_id: 6 });


      expect(spy1.callCount).to.eq(4);
      expect(spy2.callCount).to.eq(6);
    });

    it ('can detect array properties', () => {
      @store class A {}
      @store class B {}

      const spy = sinon.spy();

      A.listen(spy);
      A.bind(B, 'ids');

      B.put([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      A.put({ id: 1, ids: [1, 2, 3] });
      B.put([{ id: 2 }, { id: 1 }]);

      expect(spy.callCount).to.eq(2);
    });

    it ('can be used function property name', () => {
      @store class A {}
      @store class B {}

      const spy = sinon.spy();

      A.listen(spy);
      A.bind(B, item => item.ids.deep());

      B.put([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
      A.put({ id: 1, ids: { deep: () => [1, 2, 3] } });
      B.put([{ id: 2 }, { id: 1 }]);

      expect(spy.calledTwice).to.be.true;
    });
  });
})
