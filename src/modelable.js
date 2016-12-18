export default klass => {
  return class extends klass {
    static set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.trigger(true);

      return this;
    }

    static toArray() {
      return this.all.map(i => i.toObject());
    }

    set(data, put = true) {
      this.__keys = this.__keys || {};

      Object.keys(data).forEach(key => {
        this[key] = data[key];
        this.__keys[key] = true;
      });

      put && this.context.put(this);
    }

    getSetter(...props) {
      return value => {
        let deepProps = 'ctx';

        props.forEach(prop => {
          deepProps += `["${prop}"]`;
        });

        const fn = new Function('ctx', 'val', 'deepProps', `${deepProps} = val`);
        fn(this, value, deepProps);

        this.__keys = this.__keys || {};
        this.__keys[props[0]] = true;

        this.context.put(this);
      }
    }

    toObject() {
      const obj = {};

      Object.keys(this.__keys || {}).forEach(key => {
        obj[key] = this[key];
      });

      return JSON.parse(JSON.stringify(obj));
    }
  }
}
