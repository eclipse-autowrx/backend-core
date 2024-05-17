const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const modelRoute = require('./model.route');
const prototypesRoute = require('./prototypes.route');
const docsRoute = require('./docs.route');
const emailsRoute = require('./email.route');
const logsRoute = require('./log.route');
const discussionsRoute = require('./discussion.route');
const feedbacksRoute = require('./feedback.route');
const pluginsRoute = require('./plugin.route');
const tagsRoute = require('./tag.route');
const mediasRoute = require('./media.route');
const addOnsRoute = require('./addOn.route');
const config = require('../../config/config');

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
    route: prototypesRoute,
  },
  {
    path: '/emails',
    route: emailsRoute,
  },
  {
    path: '/logs',
    route: logsRoute,
  },
  {
    path: '/discussions',
    route: discussionsRoute,
  },
  {
    path: '/feedbacks',
    route: feedbacksRoute,
  },
  {
    path: '/plugins',
    route: pluginsRoute,
  },
  {
    path: '/tags',
    route: tagsRoute,
  },
  {
    path: '/medias',
    route: mediasRoute,
  },
  {
    path: '/addOns',
    route: addOnsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
