'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var compose = require('composable-middleware');
var tokenAuth = require('./token-auth.js');
var httpStatus = require('http-status');
var responseBuilder = require('../../components/responseBuilder/responseBuilder');


/**
 * Authentication Middleware
 *
 * Checks if the user has a token and if so checks that they have the required role for the route
 */
function hasRole(userGroup, roleRequired, userRoles) {
  //if no role required, then make the role required as user
  //as long as user's role is higher or equal than user, he can proceed to next step
    if (!roleRequired) {
      roleRequired =  config[userGroup+'Roles'][0]; //config[userGroup+'Roles'][0] is 'user'
    }

    return compose()
        .use(tokenAuth)
        .use(function meetsRequirements(req, res, next) {
            if (req.user.userGroup == userGroup){
              if (userRoles.indexOf(req.user.role) >= userRoles.indexOf(roleRequired)) {
                return next();
              }
            }
          res.json(httpStatus.UNAUTHORIZED, responseBuilder.errorResponse({}, "Role or User Group not authorized"));
        });
}

module.exports = function(userGroup, roleRequired){

    return hasRole(userGroup, roleRequired, config[userGroup+'Roles']);

};
