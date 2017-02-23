import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';

export default klass => {
  class Store extends klass {
    static contexts = {};
    static contextArray = [];
    static items = {};
    static bindings = [];
    static reverseBindings = [];

    static context(...args) {
      if (args.length === 1) {
        if (isFunction(args[0])) {
          var name = args[0].toString();
        } else {
          var name = JSON.stringify(args[0]);
        }

        if (!this.contexts[name]) {
          this.contexts[name] = class extends this {
            static citems = [];
            static contexts = {};
            static callbacks = [];
            static customKeys = [];
            static parent = this.base === this ? null : this;
          }

          // dynamic context
          if (isFunction(args[0])) {
            this.contexts[name] = class extends this.contexts[name] {
              static _setItems() {
                this.citems = this.baseContext.all.filter(args[0]).map(i => this._getKey(i));
              }
            }

            this.contexts[name]._setItems();

            this.baseContext.listen(() => {
              this.contexts[name]._setItems();
            });
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

    static triggerBranch(parent = true, children = false) {
      this.callbacks.forEach(fn => fn());
      if (parent && this.parent) this.parent.triggerBranch();

      if (children) {
        Object.keys(this.contexts).forEach(name => {
          this.contexts[name].triggerBranch(false, true);
        });
      }

      return this;
    }

    static trigger(keys, triggerBindings = true) {
      this.contextArray.forEach(context => {
        if (context.citems.find(i => keys.includes(i))) {
          context.callbacks.forEach(fn => fn());
        }
      });

      if (triggerBindings) this.triggerBindings(keys);
    }

    static triggerBindings(keys) {
      this.bindings.forEach(binding => {
        const remoteKeys = binding.store.all
          .filter(item => {
            if (isFunction(binding.property)) {
              var value = binding.property(item);
            } else {
              var value = item[binding.property];
            }

            if (isArray(value)) {
              return intersection(value, keys).length > 0;
            } else {
              return keys.includes(value);
            }
          })
          .map(item => binding.store._getKey(item));

        binding.store.trigger(remoteKeys, false);
      });

      this.reverseBindings.forEach(binding => {
        let updateKeys = [];

        keys.forEach(key => {
          if (isFunction(binding.property)) {
            updateKeys.push(binding.property(this.find(key)));
          } else {
            updateKeys.push(this.find(key)[binding.property]);
          }
        });

        binding.store.trigger(uniq(flatten(updateKeys)), false);
      });
    }

    static set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
        this.customKeys.push(key);
      });

      this.triggerBranch();

      return this;
    }

    static replace(items) {
      return this.put(items, true, true);
    }

    static put(items, trigger = true, replace = false) {
      if (!isArray(items)) return this.put([items], trigger, replace)[0];
      let keys = [];

      items.map(item => {
        const key = this._getKey(item);
        if (!this.citems.includes(key)) this.citems.push(key);
        keys.push(key);

        if (this.items[key] && !replace) {
          this.items[key] = this._merge(this.items[key], item);
        } else {
          this.items[key] = item;
        }
      });

      if (this.parent) this.parent.put(items, false, replace);

      if (trigger) {
        this.base.trigger(keys);
      }

      return keys.map(i => this.items[i]);
    }

    static remove(keys, trigger = true) {
      if (!isArray(keys)) return this.remove([keys]);

      Object.keys(this.contexts).forEach(name => {
        this.contexts[name].remove(keys, false);
      });

      this.citems = this.citems.filter(key => !keys.includes(key));
      if (trigger) this.triggerBranch(true, true);
    }

    static clean() {
      this.citems = [];
      this.customKeys.forEach(key => this[key] = undefined);
      this.triggerBranch();
      return this;
    }

    static populate(fn) {
      const result = this.baseContext.all.filter(fn).map(::this._getKey)
      this.citems.push(...result.filter(i => !this.citems.includes(i)))
      return this;
    }

    static bind(store, property) {
      store.base.bindings.push({ store: this, property });
      this.base.reverseBindings.push({ store, property });
    }

    static find(key) {
      return this.items[key];
    }
  }

  Store.base = Store;
  return Store;
}
