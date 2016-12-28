import { bind, store } from '../../src';

describe('bind', () => {
  it ('assigns bindings correctly', () => {
    @store class A {}

    @bind(A, 'a_id')
    @store class B {}

    @bind(A, 'a_id')
    @bind(B, 'b_id')
    @store class C {}

    expect(A.base.bindings).to.eql([
      { store: B, property: 'a_id' }, { store: C, property: 'a_id' }
    ]);
    expect(B.base.bindings).to.eql([{ store: C, property: 'b_id' }]);
    expect(C.base.bindings).to.eql([]);
  });
});
