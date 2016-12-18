export default klass => {
  return class extends klass {
    set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.context.put(this);
    }
  }
}
