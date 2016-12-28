export default klass => {
  return class extends klass {
    static _getKey(item) {
      return this.getKey ? this.getKey(item) : item.id;
    }

    static _merge(current, next) {
      return this.merge ? this.merge(current, next) : Object.assign({}, current, next);
    }
  }
}
