import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';

export default class Model {
  static get items() {
    this.__items = this.__items || [];
    return this.__items;
  }

  static get all() {
    return this.items;
  }

  static get first() {
    return this.all[0];
  }

  static context(name) {
    this.contexts = this.contexts || {};
    if (this.contexts[name]) return this.contexts[name];

    this.items; // call once to build items;
    this.contexts[name] = class extends this {
      static citems = [];

      static get all() {
        return this.citems;
      }

      static get first() {
        return this.all[0];
      }

      static put(item) {
        const result = super.put(item);
        if (!this.citems.find(i => i === result)) this.citems.push(result);
      }

      static populate(fn) {
        if (this.all.length) return this;

        this.items.forEach(item => {
          if (fn(item)) this.put(item);
        });

        return this;
      }
    }
    return this.contexts[name];
  }

  static put(item) {
    if (item.constructor !== this) {
      item = this.new(item);
    }

    let index;
    this.$keys.forEach(key => {
      if (!index) index = this.items.findIndex(i => i[key] === item[key]);
    });

    if (index !== -1) {
      Object.assign(this.items[index], item);
    } else {
      this.items.push(item);
    }

    return item;
  }

  static new(values) {
    const instance = new this();
    instance.set(values);
    return instance;
  }

  set(values = {}) {
    Object.keys(values).forEach(key => {
      this[key] = values[key];
    });
  }
}
