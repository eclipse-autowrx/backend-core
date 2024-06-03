const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const modelRoute = require('./model.route');
const prototypeRoute = require('./prototype.route');
const apiRoute = require('./api.route');
const emailRoute = require('./email.route');
const discussionRoute = require('./discussion.route');
const feedbackRoute = require('./feedback.route');

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
    path: '/feedbacks',
    route: feedbackRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
