export default (Klass) => {
  return class extends Klass {
    storeKeys = [];

    set(object) {
      Object.keys(object).forEach(key => {
        this[key] = object[key];
        this.storeKeys.push(key);
      });

      this.trigger();
    }

    clean() {
      super.clean();
      this.storeKeys.forEach(key => {
        delete(this[key]);
      });
    }
  }
}
