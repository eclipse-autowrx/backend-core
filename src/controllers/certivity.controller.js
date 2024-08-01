const { certivityService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getRegulations = catchAsync(async (req, res) => {
  const credentials = await certivityService.getCredentials();

  if (!credentials) {
    return res.status(502).json({
      message: 'Bad Gateway. Cannot retrieve credentials from Certivity',
    });
  }

  const { vehicleApis } = req.query;
  const regulations = await certivityService.getRegulations(credentials.access_token, vehicleApis);
  if (!regulations) {
    return res.status(502).json({
      message: 'Bad Gateway. Cannot retrieve regulations from Certivity',
    });
  }
  res.send(regulations);
});

module.exports = {
  getRegulations,
};
