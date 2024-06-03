const httpStatus = require('http-status');
const Feedback = require('../models/feedback.model');
const ApiError = require('../utils/ApiError');

/**
 * @param {Feedback.Score} score
 */
const calcAvgScore = async (score) => {
  if (!score) {
    return 0;
  }
  const total = Object.values(score).reduce((acc, cur) => acc + cur, 0);
  const count = Object.values(score).filter((value) => value > 0).length;
  return total / count;
};

/**
 *
 * @param {Object} feedbackBody
 * @returns {Promise<Feedback.Feedback>}
 */
const createFeedback = async (feedbackBody) => {
  const { score } = feedbackBody;
  const feedback = await Feedback.create({
    ...feedbackBody,
    ...(score && {
      avg_score: await calcAvgScore(score),
    }),
  });
  return feedback;
};

/**
 *
 * @param {Object} filter
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {fields} [options.fields] - Fields to select
 * @returns {Promise<QueryResult>}
 */
const queryFeedbacks = async (filter, options) => {
  const feedbacks = await Feedback.paginate(filter, options);
  return feedbacks;
};

/**
 *
 * @param {Object} feedbackId
 * @param {Object} updateBody
 * @param {string} userId
 * @returns {Promise<Feedback.Feedback>}
 */
const updateFeedbackById = async (feedbackId, updateBody, userId) => {
  const { score } = updateBody;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }

  if (String(feedback.created_by) !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  Object.assign(feedback, {
    ...updateBody,
    ...(score && {
      avg_score: await calcAvgScore(score),
    }),
  });
  await feedback.save();
  return feedback;
};

/**
 *
 * @param {*} feedbackId
 * @param {*} userId
 * @returns {Promise<void>}
 */
const deleteFeedbackById = async (feedbackId, userId) => {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  if (String(feedback.created_by) !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await feedback.remove();
};

module.exports = {
  createFeedback,
  queryFeedbacks,
  updateFeedbackById,
  deleteFeedbackById,
};
