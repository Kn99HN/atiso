class Context {
  constructor(scope, parent) {
    this.scope = scope;
    this.parent = parent;
    this.get = function (identifier) {
      if (identifier in this.scope) {
        return this.scope[identifier];
      } else if (this.parent !== undefined) {
        return this.parent.get(identifier);
      }
    };
  }
}

module.exports = {
  Context,
};
