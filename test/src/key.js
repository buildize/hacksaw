import { Model, key } from '../../src';

class User extends Model {
  @key uuid;
  @key id;

  @key
  get fn() {
     return this.name;
  }
}

describe('key', () => {
  it('adds correct keys', () => {
    expect(User.$keys).to.eql(['uuid', 'id', 'fn']);
  });

  it('can use function', () => {
    const user1 = User.context('test').put({ name: 'hello' });
    const user2 = User.context('test').put({ name: 'hello' });

    expect(user1).to.eq(user2);
  });
});
