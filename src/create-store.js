import store from './store';

export default (methods = {}) => {
  @store class Store {}

  Object.keys(methods).forEach(key => {
    Store[key] = methods[key];
  });

  return Store;
}
