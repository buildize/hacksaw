export default (Klass) => {
  return class extends Klass {
    callbacks = [];

    listen(fn) {
      this.callbacks.push(fn);
    }

    unlisten(fn) {
      const index = this.callbacks.findIndex(i => i == fn);
      this.callbacks.splice(index, 1);
    }

    trigger(...args) {
      this.callbacks.forEach(fn => fn(...args));
    }
  }
}
