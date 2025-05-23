class PrototypeListDecorator {
  constructor(prototypeList) {
    this.prototypeList = prototypeList;
  }

  async getPrototypeList() {
    let _prototypeList = this.prototypeList;
    try {
      _prototypeList = _prototypeList.map((prototype) => prototype.toJSON());
    } catch {
      // Do nothing
    }
    return _prototypeList;
  }
}

module.exports = PrototypeListDecorator;
