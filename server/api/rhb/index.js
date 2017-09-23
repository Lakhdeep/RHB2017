'use strict';

var express = require('express'),
  controller = require('./rhb.controller'),
  tokenAuth = require('../../auth/middleware/token-auth'),
  roleAuth = require('../../auth/middleware/role-auth'),
  router = express.Router();

// route middleware that will happen on every request
// router.use(tokenAuth);

router.get('/', controller.list);
router.get('/:id', controller.find);
router.post('/', controller.create);
router.post('/submit', controller.submit);
router.put('/:id', controller.update);

module.exports = router;
