'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB connection options
  mongo: {
    // uri: process.env.DB_CONNECTION ||'mongodb://admin:admin@ds027175.mlab.com:27175/esyllabus'
    //mongodb://admin:admin@ds151631.mlab.com:51631/afi-esyllabus
    //mongodb://admin:admin@ds153501.mlab.com:53501/alpha-esyllabus
    //mongodb://admin:admin@ds151651.mlab.com:51651/klm-esyllabus
  },
  emailConfig : {
    host: 'xxx.xxx.com',
    port: 25,
    auth: {
      user: 'xxx@xxx.com',
      pass: 'xxx'
    }
  },
  seedDB: false
};
