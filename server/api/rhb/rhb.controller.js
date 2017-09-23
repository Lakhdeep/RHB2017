'use strict';

var service = require('../../service/assessment.service'),
  _ = require('lodash'),
  httpStatus = require('http-status'),
  responseBuilder = require('../../components/responseBuilder/responseBuilder');

exports.list = function (req, res) {
  res.json(httpStatus.OK, responseBuilder.successResponse("yay!"));
  // service.list()
  //   .then(function(record){
  //     res.json(httpStatus.OK, responseBuilder.successResponse(record));
  //   })
  //   .otherwise(function(err){
  //     res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
  //   });
};

const GetAllDataFromThing = function () {
  let p_GetJson = new Promise(function (resolve, reject) {
    var http = require("https");
    var options = {
      "method": "GET",
      "hostname": "things.apps.bosch-iot-cloud.com",
      "port": null,
      "path": "/api/2/things?ids=rhh%3AFCD6BD100DDC",
      "headers": {
        "x-cr-api-token": "b24bd872c1a64a2cbf00187b67e209fc",
        "authorization": "Basic UkhIXHJoaDIwMTc6RGV2aWNlSHViQFJISDIwMTc=",
        "cache-control": "no-cache",
        "postman-token": "f445fd17-d5d6-1a53-c53c-03df6c930909"
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        resolve(JSON.parse(body.toString()));

      });
    });
    req.end();
  });
  return p_GetJson;
}

exports.allSensor = function (req, res) {
  //
  GetAllDataFromThing().then(function (jsonData) {
    console.log(jsonData);
    res.json(httpStatus.OK, responseBuilder.successResponse(jsonData));
  }).catch(function (error) {
    if(error !== null){
    console.error(error);
    res.end('FAILED');
    }
  });
}



exports.find = function (req, res) {
  var id = req.params.id;

  service.findById(id)
    .then(function (record) {
      if (!record) {
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, 'Unable to find the record with id: ' + id));
      } else {
        res.json(httpStatus.OK, responseBuilder.successResponse(record));
      }
    })
    .otherwise(function (err) {
      res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

exports.create = function (req, res) {
  var record = req.body;
  record.evaluatedBy = req.user._id;
  record.evaluatedAt = Date.now();

  if (_.keys(record).length === 0) {
    res.json(httpStatus.FORBIDDEN, responseBuilder.errorResponse({}, 'Cannot create empty record'));
  }

  service.create(record)
    .then(function (recordCreated) {
      res.json(httpStatus.CREATED, responseBuilder.successResponse(recordCreated));
    })
    .otherwise(function (err) {
      res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

exports.update = function (req, res) {
  var id = req.params.id, record = req.body;
  if (!record._id) {
    record._id = id;
  }
  service.update(record)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

/**
 * Assessor needs to assign task to a trainee
 *
 * @param req (params.id:  task id to assign), request.body.trainee contains the trainee id;
 * @param res ()
 * @returns {*}
 */
exports.assign = function (req, res) {
  var taskId = req.params.id, traineeId = req.body.trainee;

  service.assign(taskId, traineeId)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};


exports.submit = function (req, res) {
  var user = req.user;

  service.isSubmitted(user._id)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

