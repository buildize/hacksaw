import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';

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

  static context(...args) {
    const name = JSON.stringify(args);

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
        let result = super.put(item);
        const arrayResult = isArray(result);
        if (!arrayResult) result = [result];

        result.forEach(resultItem => {
          if (!this.citems.find(i => i === resultItem)) {
            this.citems.push(resultItem);
          }
        });

        if (arrayResult) return result;
        return result[0];
      }

      static populate(fn) {
        if (this.all.length) return this;

        this.items.forEach(item => {
          if (fn(item)) this.put(item);
        });

        return this;
      }

      static clean() {
        this.citems = [];
        return this;
      }
    }
    return this.contexts[name];
  }

  static put(item) {
    if (isArray(item)) {
      return item.map(i => this.put(i));
    }

    if (item.constructor !== this) {
      item = this.new(item);
    }

    let index;
    this.$keys.reverse().forEach(key => {
      if (!index || index === -1) {
        index = this.items.findIndex(i => i[key] === item[key]);
      }
    });

    if (index !== -1) {
      Object.assign(this.items[index], item);
      return this.items[index];
    } else {
      this.items.push(item);
      return item;
    }
  }

  static clean() {
    this.__items = [];
    return this;
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

  reload() {
    let index;
    this.constructor.$keys.reverse().forEach(key => {
      if (!index) index = this.constructor.items.findIndex(i => i[key] === this[key]);
    });

    return this.constructor.items[index];
  }
}
