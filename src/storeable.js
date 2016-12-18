import isArray from 'lodash/isArray';

export default klass => {
  return class extends klass {
    static get _keys() {
      return this.keys || ['id'];
    }

    static get all() {
      if (this.__storeable_class !== this) {
        this.__items = [];
        this.__storeable_class = this;
      }

      return this.__items;
    }

    static get first() {
      return this.all[0];
    }

    static get last() {
      return this.all[this.all.length - 1];
    }

    static put(items) {
      if (!isArray(items)) return this.put([items])[0];
      let result;

      if (this.parent) {
        result = this.parent.put(items);
        result.forEach(item => {
          const index = this.all.findIndex(i => i === item);
          if (index === -1) {
            this.all.push(item);
          }
        });
      } else {
        result = [];

        items.forEach(item => {
          if (item.constructor !== this) {
            var instance = new this;
            Object.assign(instance, item);
          } else {
            var instance = item;
          }

          let index = -1;
          this._keys.forEach(key => {
            if (index === -1) {
              index = this.all.findIndex(i => i[key] === instance[key]);
            }
          });

          if (index === -1) {
            this.all.push(instance);
            result.push(instance);
          } else {
            Object.assign(this.all[index], instance);
            result.push(this.all[index]);
          }
        });
      }

      this.trigger && this.trigger();

      return result;
    }
  }
}
