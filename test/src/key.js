import { Model, key } from '../../src';

class User extends Model {
  @key uuid;
  @key id;
}

describe('key', () => {
  it('adds correct keys', () => {
    expect(User.$keys).to.eql(['uuid', 'id']);
  });
});
