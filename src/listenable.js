export default klass => {
  return class extends klass {
    static get callbacks() {
      if (this.__callback_class !== this) {
        this.__callback_class = this;
        this.__callbacks = [];
      }

      return this.__callbacks;
    }

    static listen(fn) {
      this.callbacks.push(fn);
      return this;
    }

    static unlisten(fn) {
      const index = this.callbacks.findIndex(i => i == fn);
      this.callbacks.splice(index, 1);
      return this;
    }

    static trigger(parents = false) {
      this.callbacks.forEach(fn => fn());
      if (parents && this.parent.parent) this.parent.trigger(true);
      return this;
    }
  }
}
