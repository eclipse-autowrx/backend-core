const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const modelRoute = require('./model.route');
const prototypeRoute = require('./prototype.route');
const apiRoute = require('./api.route');

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
