const sortObject = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

module.exports = {
  sortObject,
};
