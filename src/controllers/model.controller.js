const httpStatus = require('http-status');
const { modelService, apiService, permissionService, extendedApiService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { PERMISSIONS } = require('../config/roles');
const logger = require('../config/logger');

const createModel = catchAsync(async (req, res) => {
  const { cvi, custom_apis, extended_apis, ...reqBody } = req.body;
  const model = await modelService.createModel(req.user.id, {
    ...reqBody,
  });

  // if (cvi) {
  //   // await apiService.createApi(model._id, cvi);
  // }

  try {
    if (extended_apis) {
      await Promise.all(
        extended_apis.map((api) =>
          extendedApiService.createExtendedApi({
            model: model._id,
            apiName: api.apiName,
            description: api.description,
            skeleton: api.skeleton,
            tags: api.tags,
            type: api.type,
            datatype: api.datatype,
            isWishlist: api.isWishlist || false,
          })
        )
      );
    }
  } catch (error) {
    logger.warn(`Error in creating model (creating extended_apis): ${error}`);
  }

  try {
    if (custom_apis) {
      let apis = custom_apis;
      try {
        apis = JSON.parse(custom_apis);
      } catch (error) {
        // Do nothing
      }

      if (Array.isArray(apis)) {
        await Promise.all(
          apis.map((api) =>
            extendedApiService.createExtendedApi({
              model: model._id,
              apiName: api.name || api.apiName || 'Vehicle',
              description: api.description || '',
              skeleton: api.skeleton || '{}',
              tags: api.tags || [],
              type: api.type || 'branch',
              datatype: api.datatype || (api.type !== 'branch' ? 'string' : null),
              isWishlist: api.isWishlist || false,
            })
          )
        );
      }
    }
  } catch (error) {
    logger.warn(`Error in creating model (creating extended_apis): ${error}`);
  }

  res.status(httpStatus.CREATED).send(model);
});

const listModels = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'visibility', 'tenant_id', 'vehicle_category', 'main_api', 'id', 'created_by']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields']);
  const advanced = pick(req.query, ['is_contributor']);
  const models = await modelService.queryModels(filter, options, advanced, req.user?.id);
  res.json(models);
});

const getModel = catchAsync(async (req, res) => {
  const hasWritePermission = await permissionService.hasPermission(req.user?.id, PERMISSIONS.WRITE_MODEL, req.params.id);

  const model = await modelService.getModelById(req.params.id, req.user?.id, hasWritePermission);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }

  const finalResult = model.toJSON();

  if (hasWritePermission) {
    const contributors = await permissionService.listAuthorizedUser({
      role: 'model_contributor',
      ref: req.params.id,
    });
    const members = await permissionService.listAuthorizedUser({
      role: 'model_member',
      ref: req.params.id,
    });
    finalResult.contributors = contributors;
    finalResult.members = members;
  }

  res.send(finalResult);
});

const updateModel = catchAsync(async (req, res) => {
  const model = await modelService.updateModelById(
    req.params.id,
    {
      ...req.body,
      ...(req.body.custom_apis && { custom_apis: JSON.parse(req.body.custom_apis) }),
    },
    req.user.id
  );
  res.send(model);
});

const deleteModel = catchAsync(async (req, res) => {
  await modelService.deleteModelById(req.params.id, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const addAuthorizedUser = catchAsync(async (req, res) => {
  const userIds = req.body.userId?.split(',');
  const promises = userIds.map((userId) =>
    modelService.addAuthorizedUser(req.params.id, { userId, role: req.body.role }, req.user.id)
  );
  await Promise.all(promises).catch((err) => {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  });
  res.status(httpStatus.CREATED).send();
});

const deleteAuthorizedUser = catchAsync(async (req, res) => {
  await modelService.deleteAuthorizedUser(
    req.params.id,
    {
      role: req.query.role,
      userId: req.query.userId,
    },
    req.user.id
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const getComputedVSSApi = catchAsync(async (req, res) => {
  if (!(await permissionService.canAccessModel(req.user?.id, req.params.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const data = await apiService.computeVSSApi(req.params.id);
  res.send(data);
});

module.exports = {
  createModel,
  listModels,
  getModel,
  updateModel,
  deleteModel,
  addAuthorizedUser,
  deleteAuthorizedUser,
  getComputedVSSApi,
};
