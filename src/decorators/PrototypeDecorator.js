class PrototypeDecorator {
  constructor(prototype) {
    this.prototype = prototype;
  }

  async getPrototype() {
    let _prototype = this.prototype;
    try {
      _prototype = this.prototype.toJSON();
    } catch (error) {
      // Do nothing
    }

    return _prototype;
  }
}

module.exports = PrototypeDecorator;
