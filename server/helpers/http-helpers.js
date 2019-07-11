var querystring = require('querystring');
var https = require('https');
var http = require('http');
var request = require('request');
var j = request.jar();
var auth = require('../configs/auth');
var baseUrlConfig = require('../configs/baseUrl-config');
var urlConfig = require('../configs/url-configs');
var helpers = {};
var fs = require("fs");

helpers.makeGetRequest = function (target, endpoint, callback) {
  var headers = {
    "Authorization": "Basic " + new Buffer(auth.userName + ":" + auth.password).toString("base64"),
    "Content-Type": "application/json"
  }
  var options = {
    url: baseUrlConfig[target].baseUrl + urlConfig[target][endpoint].convertedURL + '$format=json',
    method: 'GET',
    headers: headers
  }
  console.log(options.url);
  request(options, (error, response, body) => {
    callback(error, response, body);
  });
}

helpers.makePostRequest = function (target, endpoint, requestData, callback) {
  request({
    url: "http://ussltcsnl1370.solutions.glbsnet.com:8002/sap/opu/odata/sap/ZDMD_DYNUI_SRV/$metadata",
    jar: j,
    headers: {
      "Authorization": "Basic " + new Buffer(auth.userName + ":" + auth.password).toString("base64"),
      "x-csrf-token": "Fetch"
    }
  }, function (error, response, body) {
    token = response.headers["x-csrf-token"];
    console.log(baseUrlConfig[target].baseUrl + urlConfig[target][endpoint].convertedURL);
    request({
      url: baseUrlConfig[target].baseUrl + urlConfig[target][endpoint].convertedURL,
      method: 'POST',
      jar: j,
      headers: {
        "Authorization": "Basic " + new Buffer(auth.userName + ":" + auth.password).toString("base64"),
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-Token": token, // set CSRF Token for post or update
      },
      json: requestData
    }, function (error, response, body) {
      callback(error, response, body);
    });
  });
}

module.exports = helpers;
