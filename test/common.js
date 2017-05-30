import chai from 'chai';
import lodash from 'lodash';
import sinon from 'sinon';

global.expect = chai.expect;
global._ = lodash;
global.sinon = sinon;

global.commonTests = {
  implementsListener(Klass) {
    expect(Klass.prototype.listen.constructor).to.eq(Function);
    expect(Klass.prototype.unlisten.constructor).to.eq(Function);
    expect(Klass.prototype.trigger.constructor).to.eq(Function);
  },

  implementsStore(Klass) {
    expect(Klass.prototype.set.constructor).to.eq(Function);
  }
}
