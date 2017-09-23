'use strict';
/**
 * token-auth.js
 *
 *
 * Authentication Middleware:
 *  Parses the JWT token attached to the request. If valid the user
 *  will be attached to the request.
 *
 *  Uses jwt-simple tokens.
 */

var url = require('url');
var userService = require('../../service/user.service');
var httpStatus = require('http-status');
var responseBuilder = require('../../components/responseBuilder/responseBuilder');

var jwt = require('jwt-simple');
var config = require('../../config/environment');

module.exports = function (req, res, next) {

    // Parse the URL in case we need it
    var parsed_url = url.parse(req.url, true);

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    var token = (req.body && req.body.access_token) ||
        parsed_url.query.access_token || req.headers["x-access-token"];

    if (!token) {
        // failed auth
      res.json(httpStatus.UNAUTHORIZED, responseBuilder.errorResponse({}, "token not specified!"));
    }else{
      try {
        var decoded = jwt.decode(token, config.secrets.jwtTokenSecret);

        if (decoded.exp <= Date.now()) {
          res.json(httpStatus.UNAUTHORIZED, responseBuilder.errorResponse({}, "token expired"));
        }else{
          userService.findById(decoded.iss)
            .then(function (user) {
              req.user = user;
              next();
            })
        }
      } catch (err) {
        // failed auth
        res.json(httpStatus.UNAUTHORIZED, responseBuilder.errorResponse({}, "illegal token"));
      }
    }


};
