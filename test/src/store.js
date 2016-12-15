import { store, key } from '../../src';
import uuid from 'uuid/v4';

describe('store', () => {
  describe('#context', () => {
    @store class User {}
    @store class Article {}

    it('returns same context', () => {
      expect(User.context('test')).to.eq(User.context('test'));
    });

    it('returns different context', () => {
      expect(User.context('test')).to.not.eq(User.context('test2'));
    });

    it('returns different context with different models', () => {
      expect(User.context('test')).to.not.eq(Article.context('test'));
    });

    it('can accept multiple parameters', () => {
      expect(User.context('1', '2')).to.not.eq(User.context('1', '3'));
    })
  });

  describe('#all', () => {
    @store
    class User {
      @key id;

      constructor(id) {
        this.id = id;
      }
    }

    User.context('test').put(new User(1));
    User.context('hello').put(new User(2));
    User.context('another').put(new User(1));
    User.context('hello').put(new User(3));

    it('returns all items without context', () => {
      expect(User.all.map(i => i.id)).to.eql([1, 2, 3]);
    });

    it('return correct items with context', () => {
      expect(User.context('hello').all.map(i => i.id)).to.eql([2, 3]);
    });
  });

  describe('#populate', () => {
    @store
    class User {
      @key id;
    }

    @store
    class Article {
      @key id;
    }

    User.context('a').put(User.new({ id: 1 }));
    User.context('a').put(User.new({ id: 2 }));
    User.context('a').put(User.new({ id: 3 }));
    User.context('a').put(User.new({ id: 4 }));
    Article.context('a').put(Article.new({ id: 555 }));

    it('fills correct objects', () => {
      User.context('new').populate(i => i.id % 2 === 0);
      Article.context('new').populate(i => i);

      expect(User.context('new').all.map(i => i.id)).to.eql([2, 4]);
      expect(Article.context('new').first.id).to.eql(555);
    });
  });

  describe('#put', () => {
    @store
    class User {
      @key uuid = uuid();
      @key id;
    }

    it('create instance if argument is object', () => {
      User.put({ id: 5 });
      expect(User.first.constructor).to.eq(User);
    });

    it('overrides by last key', () => {
      const user1 = User.put({ id: 15 });
      const user2 = User.new({ id: 15 });
      expect(user1.uuid).to.not.eq(user2.uuid);
      User.put(user2);
      expect(user1.uuid).to.eq(user2.uuid);
      expect(user1).to.eq(user2.reload());
    });

    it('can accept array', () => {
      User.context('array').put([{ id: 1 }, { id: 2 }]);
      expect(User.context('array').all.length).to.eq(2);
    });

    it('runs callbacks without context', () => {
      const spy = sinon.spy();
      User.listen(spy);
      User.put([{ id: 1 }, { id: 2 }]);
      expect(spy.calledOnce).to.be.true;
    });

    it('runs callbacks without context', () => {
      const spy = sinon.spy();
      User.context('hey').listen(spy);
      User.context('hey').put([{ id: 1 }, { id: 2 }]);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('#new', () => {
    @store class AModel {}

    it('sets correct values', () => {
      const item = AModel.new({ id: 5, name: 15 });
      expect(item.id).to.eq(5);
      expect(item.name).to.eq(15);
    });
  });

  describe('#clean', () => {
    @store class AModel {
      @key id;
    }

    it('cleans context', () => {
      AModel.context('test').put({ id: 1 });
      AModel.context('test2').put({ id: 1 });
      expect(AModel.context('test').all.length).to.eq(1);
      AModel.context('test').clean();
      expect(AModel.context('test').all.length).to.eq(0);
      expect(AModel.context('test2').all.length).to.eq(1);
    });

    it('returns context class', () => {
      expect(AModel.context('test').clean()).to.eq(AModel.context('test'));
    });

    it('cleans global items', () => {
      expect(AModel.all.length).to.eq(1);
      AModel.clean();
      expect(AModel.all.length).to.eq(0);
    });

    it('returns base class', () => {
      expect(AModel.clean()).to.eq(AModel);
    });
  });

  describe('#listen', () => {
    @store class User {}

    it('adds function to callbacks without context', () => {
      const fn = () => ({});
      User.listen(fn);
      expect(User.__callbacks).to.eql([fn]);
    });

    it('adds function to callbacks with context', () => {
      const fn = () => ({});
      User.context('hello').listen(fn);
      User.context('hello').listen(fn);
      expect(User.context('hello').__callbacks).to.eql([fn, fn]);
    });

    it('returns instance', () => {
      const fn = () => ({});
      expect(User.listen(fn)).to.eq(User);
      expect(User.context('hello').listen(fn)).to.eq(User.context('hello'));
    });
  });

  describe('.set', () => {
    @store class User {
      id = 15;
      another = 'test';
    };

    it('sets correct values', () => {
      const user = new User();
      user.set({ id: 5, name: 'albert' });
      expect(user.id).to.eq(5);
      expect(user.name).to.eq('albert');
      expect(user.another).to.eq('test');
    });

    it('runs callbacks', () => {
      const spy = sinon.spy();
      const user = new User();
      user.listen(spy);
      user.set({ name: 'test' });
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('.getSetter', () => {
    @store class User {}

    it('sets value correctly', () => {
      const user = new User();
      user.getSetter('name')('hello');
      expect(user.name).to.eq('hello');
    });

    it('sets deeply', () => {
      const user = new User();
      user.items = [{}, { others: [{}, {}], another: {} }];

      user.getSetter('items', 0, 'name')('test');
      user.getSetter('items', 1, 'others', 1, 'number')(15);
      user.getSetter('items', 1, 'another', 'array')([1,2,3]);

      expect(user.items[0].name).to.eq('test');
      expect(user.items[1].others[1].number).to.eq(15);
      expect(user.items[1].another.array).to.eql([1,2,3]);
    });

    it('runs callbacks', () => {
      const spy = sinon.spy();
      const user = new User();
      user.listen(spy);
      user.getSetter('name')('value');
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('.listen', () => {
    @store class User {}

    it('adds function to callbacks correctly', () => {
      const fn = () => ({});
      const user = new User();
      user.listen(fn);
      expect(user.__callbacks).to.eql([fn]);
    });

    it('returns instance', () => {
      const fn = () => ({});
      const user = new User();
      expect(user.listen(fn)).to.eq(user);
    });
  });
});
