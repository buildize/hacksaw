import contextable from '../../src/contextable';

describe('contextable', () => {
  it ('creates create node correctly', () => {
    @contextable class A {}

    expect(A.context('node1', 'node2').parent).to.eq(A.context('node1'));
    expect(A.context('node1', 'node2', 'node2').parent).to.eq(A.context('node1', 'node2'));
    expect(A.context('node1').parent).to.eq(A);
  });

  it ('returns base class methods correctly', () => {
    @contextable class A {
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

  it ('set instance contexts correctly', () => {
    @contextable class B {}
    const instance = new (B.context('n1', 'n2'));
    expect(instance.context).to.eq(B.context('n1', 'n2'));
  })
})
