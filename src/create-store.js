import Store from './store';

const defaultOptions = {
  tables: {}
};

export default (opts = {}) => {
  const options = Object.assign({}, defaultOptions, opts);
  const store = new Store(options);
  return store;
}
