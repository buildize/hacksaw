import listenable from '../../src/listenable';

@listenable
class TestClass {}

describe('listenable.listen', () => {
  it('adds callbacks correctly', () => {
    const table = new TestClass();
    const fn = () => ({});
    table.listen(fn);
    expect(table.callbacks).to.eql([fn]);
  });
});

describe('listenable.unlisten', () => {
  it('removes callbacks correctly', () => {
    const table = new TestClass();
    const fn1 = () => ({});
    const fn2 = () => ({});
    table.listen(fn1);
    table.listen(fn2);
    table.unlisten(fn1);
    expect(table.callbacks).to.eql([fn2]);
  });
});

describe('listenable.trigger', () => {
  it('triggers all callbacks', () => {
    const table = new TestClass();
    const fn1 = sinon.spy();
    const fn2 = sinon.spy();
    table.listen(fn1);
    table.listen(fn2);
    table.trigger();

    expect(fn1.calledOnce).to.be.true;
    expect(fn2.calledOnce).to.be.true;
  });
});
