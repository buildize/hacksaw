export default klass => {
  return class extends klass {
    static contexts = {}

    static context(...args) {
      if (args.length === 1) {
        const name = args[0];

        this.contexts[name] = this.contexts[name] || class extends this {
          static contexts = {};
          static parent = this;
          context = this.constructor.parent.contexts[name];
        }

        return this.contexts[name];
      } else {
        return this.context(args[0]).context(...args.slice(1));
      }
    }
  }
}
