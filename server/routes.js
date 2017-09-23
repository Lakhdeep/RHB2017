/**
 * Main application routes
 */

'use strict';

var express = require('express');
var errors = require('./components/errors');
//var cors = require('./auth/middleware/cors.js');

module.exports = function (app) {

//    app.use(cors);

    //login
    // app.use('/api/tokens', require('./api/token'));
  //
  //   // console user routes
  //   app.use('/api/console/engine-repair-orders', require('./api/engineRepairOrder'));
  //   app.use('/api/console/customer-company', require('./api/customerCompany'));
  //   app.use('/api/console/customer-staff', require('./api/customerStaff'));
  //   app.use('/api/console/console-user', require('./api/consoleUser'));
  //   app.use('/api/console/engine', require('./api/engine'));
  //   app.use('/api/console/part-needed', require('./api/partNeededDate'));
  //   app.use('/api/console/delay', require('./api/delay'));
  //   app.use('/api/console/llp', require('./api/llp'));
  //   app.use('/api/console/action', require('./api/action'));
  //   app.use('/api/console/dashboard', require('./api/dashboard'));
  //   app.use('/api/console/major-module', require('./api/majorModule'));
  //   app.use('/api/console/engine-status-production', require('./api/engineStatusProduction'));
  //
  // //consumer routes
  //   app.use('/api/consumer/engine-repair-orders', require('./api/engineRepairOrder'));
  //   app.use('/api/consumer/customer-company', require('./api/customerCompany'));
  //   app.use('/api/consumer/customer-staff', require('./api/customerStaff'));
  //   app.use('/api/consumer/action', require('./api/action'));
  //   app.use('/api/consumer/dashboard', require('./api/dashboard'));
  //   app.use('/api/consumer/part-needed', require('./api/partNeededDate'));
  //   app.use('/api/consumer/delay', require('./api/delay'));
  //
  //   //for e-syllabus
  // app.use('/api/program', require('./api/program'));
  // app.use('/api/user', require('./api/user'));
  // app.use('/api/task', require('./api/task'));
  // app.use('/api/assessment', require('./api/assessment'));
  // app.use('/api/assignment', require('./api/assignment'));
  app.use('/api/rhb', require('./api/rhb'));


  // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            //res.sendfile(app.get('appPath') + '/index.html');
          res.redirect(301, '/');
        });
};
