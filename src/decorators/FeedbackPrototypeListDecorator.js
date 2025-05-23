const PrototypeListDecorator = require('./PrototypeListDecorator');
const { feedbackService } = require('../services');

class FeedbackPrototypeListDecorator extends PrototypeListDecorator {
  async getPrototypeList() {
    const _prototypeList = await super.getPrototypeList();
    const prototypeIds = _prototypeList.map((prototype) => prototype.id || prototype._id);
    const avgScoreByPrototype = await feedbackService.calcAvgScoreOfPrototypes(prototypeIds);
    _prototypeList.forEach((prototype) => {
      const prototypeId = prototype.id || prototype._id;
      prototype.avg_score = avgScoreByPrototype[prototypeId] || null;
    });
    return _prototypeList;
  }
}

module.exports = FeedbackPrototypeListDecorator;
