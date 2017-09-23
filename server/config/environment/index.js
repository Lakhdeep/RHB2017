'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

var actionStatus = {
  'Open': 0,
  'Reopen': 0,
  'Close Approved': 2,
  'Close Rejected': 2,
  'On Hold': 1,
  'Cancel Show': 2,
  'Cancel Not Show': 3
};

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        jwtTokenSecret: 'ENGINE_STATUS_MROLAB'
    },

    // List of roles (the order of these matters)
    customerStaffRoles: [ 'user', 'admin'],


    engineStatusList : ['Incoming Inspection', 'Desassembly', 'Repair', 'Reassembly', 'Bench Test', 'Serviceable', 'Work Stoppage', 'No Status'],
    actionStatus : actionStatus,
    actionStatusList: Object.keys(actionStatus),
    actionActionLeaders: ['Air Canada', 'AFI KLM E&M', 'Others'],


    moduleNameList: ['21X Booster', '23X FHFModule', 'Core Engine', 'LPT Module'],
    engineStatusProductionNameList: ['Incoming Disassy', 'Clean And Inspect', 'Kitting', 'Sub Assy', 'Final Assy', 'Test'],
    engineStatusProductionTargetDayList: [15, 21, 47, 65, 82, 86],
    partNeededDate: {
      actionLeaders: ['Air Canada', 'AFI KLM E&M', 'Others'],
      status: ['Open','Closed']
    },
  //For project e-Syllabus
  assQuestions: ['scans the environment before starting the task to ensure safety',
    'reads/interprets the safety warning correctly',
    'follows the procedure steps', 'interprets the reports and indications correctly',
    'makes the correct interpretation on FIM, AMM, MEL and other related procedures',
    'restores the aircraft back to initial condition (or appropriate condition depending on the circumstances)'],
  userGroup : {
    CONSOLE : 'consoleUser',
    CUSTOMER : 'customerStaff',
    ASSESSOR : 'Assessor',
    TRAINEE: 'Trainee'
  },
  userRoles: [ 'user', 'admin'],
  assignmentStatus: ['WIP', 'Pending','Completed'],


  // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    token: {
        unitOfTime : 'days',
        amount : 30
    }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
        require('./' + process.env.NODE_ENV + '.js') || {});
