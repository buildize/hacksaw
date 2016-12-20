export default klass => {
  return class extends klass {
    static set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.trigger(true);

      return this;
    }
  }
}
