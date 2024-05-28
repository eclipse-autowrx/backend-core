const { MODEL } = require('./MODEL');

// eslint-disable-next-line no-unused-vars
const PROTOTYPE = (profile, model, prototype) => {
  return {
    canRead() {
      return MODEL(profile, model).canRead();
    },
    canEdit() {
      return MODEL(profile, model).canEdit();
    },
  };
};

module.exports = {
  PROTOTYPE,
};
