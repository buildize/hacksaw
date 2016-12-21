import base from './base';
import defaults from './defaults';

export default klass => {
  @base
  @defaults
  class Model extends klass {}
  Model.baseContext = Model.context('$$base$$');
  return Model.baseContext;
}
