export default (Klass) => {
  return class extends Klass {
    set(object) {
      Object.keys(object).forEach(key => {
        this[key] = object[key];
      });

      this.trigger();
    }
  }
}
