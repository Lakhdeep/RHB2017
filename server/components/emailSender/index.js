/**
 * Created by leon on 24/2/17.
 */
'use strict';
const nodemailer = require('nodemailer');
const emailConfig = require('../../config/environment').emailConfig;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(emailConfig);

function send(recipients, subject, html){
  // setup email data with unicode symbols
  var mailOptions = {
    from:  'AF KLM E&M Notification <'+ emailConfig.auth.user +'>', // sender address
    to: recipients.join(), // list of receivers
    subject: subject,// Subject line
    html: html// html body
  };
  console.log('Email Option: ', mailOptions);
// send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

}

function actionNotification(recipients, roNumber, action, actionDescription){
  var subject = '[Engine Repair Order App] "'+ roNumber + '" has been '+ action +'.';
  var html = '<p>The action for Repair Order '+ roNumber + ' has been '+ action +' on '+ (new Date()) +' </p><br><br>\
  --<br>\
    <p>This is an automatically generated email please do not reply.</p>\
  ';
  send(recipients, subject,html);
}

module.exports = {
  send: send,
  actionNotification: actionNotification
};
