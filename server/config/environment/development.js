'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //use Wang Jun's mongoDB account
    uri: process.env.DB_CONNECTION ||'mongodb://admin:password@ds147964.mlab.com:47964/rhb2017'
    //mongodb://admin:admin@ds151631.mlab.com:51631/afi-esyllabus
    //mongodb://admin:admin@ds153501.mlab.com:53501/alpha-esyllabus
    //mongodb://admin:admin@ds151651.mlab.com:51651/klm-esyllabus
  },
  emailConfig : {
    host: 'xxx.xxx.com',
    port: 25,
    auth: {
      user: 'xxx',
      pass: 'xxx'
    }
  },
  seedDB: false
};
