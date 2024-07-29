const PrototypeDecorator = require('./PrototypeDecorator');
const feedbackService = require('../services/feedback.service');

class FeedbackPrototypeDecorator extends PrototypeDecorator {
  async getPrototype() {
    const _prototype = await super.getPrototype();

    const avg_score = await feedbackService.calcAvgScoreOfPrototype(_prototype);
    _prototype.avg_score = avg_score;

    return _prototype;
  }
}

module.exports = FeedbackPrototypeDecorator;
