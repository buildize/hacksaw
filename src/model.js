import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';

export default class Model {
  __callbacks = [];

  static get items() {
    this.__items = this.__items || [];
    return this.__items;
  }

  static get __callbacks() {
    this.___callbacks = this.___callbacks || [];
    return this.___callbacks;
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
      static ___callbacks = [];

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

  static put(...args) {
    return this.__put(...args);
  }

  static __put(item, trigger = true) {
    if (isArray(item)) {
      const result = item.map(i => this.__put(i, false));
      this.trigger();
      return result;
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

    let result;

    if (index !== -1) {
      Object.assign(this.items[index], item);
      result = this.items[index];
    } else {
      this.items.push(item);
      result = item;
    }

    if (trigger) this.trigger();

    return result;
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

  static listen(fn) {
    this.__callbacks.push(fn);
    return this;
  }

  static trigger() {
    this.__callbacks.forEach(fn => fn());
  }

  set(values = {}) {
    Object.keys(values).forEach(key => {
      this[key] = values[key];
    });

    this.trigger();
  }

  getSetter(...props) {
    return value => {
      let deepProps = 'ctx';

      props.forEach(prop => {
        deepProps += `["${prop}"]`;
      });

      const fn = new Function('ctx', 'val', 'deepProps', `${deepProps} = val`);
      fn(this, value, deepProps);
      this.trigger();
    }
  }

  listen(callback) {
    this.__callbacks.push(callback);
    return this;
  }

  trigger() {
    this.__callbacks.forEach(fn => fn());
  }

  reload() {
    let index;
    this.constructor.$keys.reverse().forEach(key => {
      if (!index) index = this.constructor.items.findIndex(i => i[key] === this[key]);
    });

    return this.constructor.items[index];
  }
}
