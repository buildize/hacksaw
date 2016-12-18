export default klass => {
  return class extends klass {
    static set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.trigger(true);

      return this;
    }

    set(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });

      this.context.put(this);
    }

    getSetter(...props) {
      return value => {
        let deepProps = 'ctx';

        props.forEach(prop => {
          deepProps += `["${prop}"]`;
        });

        const fn = new Function('ctx', 'val', 'deepProps', `${deepProps} = val`);
        fn(this, value, deepProps);

        this.context.put(this);
      }
    }
  }
}
