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

    trigger() {
      this.callbacks.forEach(fn => fn());
    }
  }
}
