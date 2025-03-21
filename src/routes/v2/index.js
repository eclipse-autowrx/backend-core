const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const modelRoute = require('./model.route');
const prototypeRoute = require('./prototype.route');
const apiRoute = require('./api.route');
const emailRoute = require('./email.route');
const discussionRoute = require('./discussion.route');
const genaiRoute = require('./genai.route');
const feedbackRoute = require('./feedback.route');
const permissionRoute = require('./permission.route');
const extendedApiRoute = require('./extendedApi.route');
const issueRoute = require('./issue.route');
const searchRoute = require('./search.route');
const certivityRoute = require('./certivity.route');
const assetRoute = require('./asset.route');
const changeLogRoute = require('./changeLog.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/models',
    route: modelRoute,
  },
  {
    path: '/prototypes',
    route: prototypeRoute,
  },
  {
    path: '/apis',
    route: apiRoute,
  },
  {
    path: '/emails',
    route: emailRoute,
  },
  {
    path: '/discussions',
    route: discussionRoute,
  },
  {
    path: '/genai',
    route: genaiRoute,
  },
  {
    path: '/feedbacks',
    route: feedbackRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute,
  },
  {
    path: '/extendedApis',
    route: extendedApiRoute,
  },
  {
    path: '/issues',
    route: issueRoute,
  },
  {
    path: '/search',
    route: searchRoute,
  },
  {
    path: '/certivity',
    route: certivityRoute,
  },
  {
    path: '/assets',
    route: assetRoute,
  },
  {
    path: '/change-logs',
    route: changeLogRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
