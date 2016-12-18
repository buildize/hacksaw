import contextable from './contextable';
import listenable from './listenable';
import storeable from './storeable';
import modelable from './modelable';

export default klass => {
  @contextable
  @listenable
  @storeable
  @modelable
  class Model extends klass {}
  return Model.context('$$base$$');
}
