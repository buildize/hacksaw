import isArray from 'lodash/isArray';
import clone from 'lodash/clone';

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

    static clean() {
      this.all.splice(0, this.all.length);
      this.trigger && this.trigger();
      return this;
    }

    static populate(fn) {
      const base = this.firstContext;
      this.all.push(...base.all.filter(fn));
      return this;
    }

    static clone(fn) {
      const base = this.firstContext;
      this.all.push(...base.all.filter(fn).map(i => clone(i)));
      return this;
    }

    static put(items) {
      if (!isArray(items)) return this.put([items])[0];
      let result;

      if (this.parent.parent) {
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
          let index = -1;
          this._keys.forEach(key => {
            if (index === -1) {
              index = this.all.findIndex(i => i[key] === item[key]);
            }
          });

          if (index === -1) {
            this.all.push(item);
            result.push(item);
          } else {
            Object.assign(this.all[index], item);
            result.push(this.all[index]);
          }
        });
      }

      this.trigger();

      return result;
    }
  }
}
