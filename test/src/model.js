import { Model, key } from '../../src';
import uuid from 'uuid/v4';

describe('Model', () => {
  describe('#context', () => {
    class User extends Model {}
    class Article extends Model {}

    it('returns same context', () => {
      expect(User.context('test')).to.eq(User.context('test'));
    });

    it('returns different context', () => {
      expect(User.context('test')).to.not.eq(User.context('test2'));
    });

    it('returns different context with different models', () => {
      expect(User.context('test')).to.not.eq(Article.context('test'));
    });
  });

  describe('#all', () => {
    class User extends Model {
      @key id;

      constructor(id) {
        super();
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
    class User extends Model {
      @key id;
    }

    class Article extends Model {
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
    class User extends Model {
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
  });

  describe('#new', () => {
    class AModel extends Model {}

    it('sets correct values', () => {
      const item = AModel.new({ id: 5, name: 15 });
      expect(item.id).to.eq(5);
      expect(item.name).to.eq(15);
    });
  });

  describe('#clean', () => {
    class AModel extends Model {
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

  describe('.set', () => {
    class User extends Model {
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
  });
});
