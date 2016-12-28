export default (store, property) => {
  return klass => {
    klass.bind(store, property);
    return klass;
  }
}
