import isArray from 'lodash/isArray';

export default klass => {
  class Store extends klass {
    static contexts = {};
    static contextArray = [];
    static items = {};

    static context(...args) {
      if (args.length === 1) {
        const name = JSON.stringify(args[0]);

        if (!this.contexts[name]) {
          this.contexts[name] = class extends this {
            static citems = [];
            static contexts = {};
            static callbacks = [];
            static parent = this.base === this ? null : this;
          }

          this.contextArray.push(this.contexts[name]);
        }

        return this.contexts[name];
      } else {
        return this.context(args[0]).context(...args.slice(1));
      }
    }

    static get all() {
      return this.citems.map(i => this.items[i])
    }

    static get first() {
      return this.all[0];
    }

    static get last() {
      return this.all[this.all.length - 1];
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

    static triggerBranch() {
      this.callbacks.forEach(fn => fn());
      if (this.parent) this.parent.triggerBranch();

      return this;
    }

    static trigger(keys) {
      this.contextArray.forEach(context => {
        if (context.citems.find(i => keys.includes(i))) {
          context.callbacks.forEach(fn => fn());
        }
      });
    }

    static set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.triggerBranch();

      return this;
    }

    static put(items, trigger = true) {
      if (!isArray(items)) return this.put([items])[0];
      let keys = [];

      items.map(item => {
        const key = this._getKey(item);
        if (!this.citems.includes(key)) this.citems.push(key);
        keys.push(key);

        if (this.items[key]) {
          this.items[key] = this._merge(this.items[key], item);
        } else {
          this.items[key] = item;
        }
      });

      if (this.parent) this.parent.put(items, false);

      if (trigger) {
        this.base.trigger(keys);
      }

      return keys.map(i => this.items[i]);
    }

    static clean() {
      this.citems = [];
      this.triggerBranch();
      return this;
    }

    static populate(fn) {
      const items = Object.values(this.items);
      const result = items.filter(fn).map(::this._getKey)
      this.citems.push(...result.filter(i => !this.citems.includes(i)))
      return this;
    }
  }

  Store.base = Store;
  return Store;
}
