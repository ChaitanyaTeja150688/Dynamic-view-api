var httpHelpers = require('../../helpers/http-helpers');
var sapTransforms = require('../../helpers/sap-tranforms');
var urlConfig = require('../../configs/url-configs');
var fs = require("fs");

var adminController = {};

// Retrives all config's with app details
adminController.dashboard = function (req, res) {
    urlConfig.sap.admindashboard.convertedURL =  urlConfig.sap.admindashboard.url + req.params.appId + '%27&';
    httpHelpers.makeGetRequest('sap', 'admindashboard', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            // transform response to that needed on UI
            var appDetails = sapTransforms.mapAppDetails(JSON.parse(body)['d']['results']);
            res.json(appDetails);
        }
    });
}

// Retrives meta data like, material list, role list
adminController.getMetaData = function (req, res) {
    httpHelpers.makeGetRequest('sap', 'metadata', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            // transform response to that needed on UI
            var appIds = sapTransforms.mapAppIds(JSON.parse(body)['d']['results']);
            res.json(appIds);
        }
    });
}

// Retrives default field list based on AppID
adminController.getAppDependentData = function (req, res) {
    urlConfig.sap.appdependentlist.convertedURL = urlConfig.sap.appdependentlist.url + "'" + req.params.appId + "'" + urlConfig.sap.appdependentlist.subUrl;
    httpHelpers.makeGetRequest('sap', 'appdependentlist', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            // transform response to that needed on UI
            var config = sapTransforms.mapAppDependentList(JSON.parse(body)['d']['results'][0]['Nav_DefaultFields']['results']);
            res.json(config);
        }
    });
}

// Retrives config fields list based on AppID and default fields change
adminController.getConfigfields = function (req, res) {
    var configData = {
        Appid: req.body.appId,
        Appname: req.body.appName,
        Nav_DefaultFields: req.body.defaultFields,
        Nav_AppId_FieldConfig:[],
        Nav_TableData: [],
        Nav_LongText: [],
        Nav_AppFieldSet_Dependent: []
    };
    // fs.writeFile("./sample1.txt", JSON.stringify(configData), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    // });
    httpHelpers.makePostRequest('sap', 'getConfigFields', configData, function (error, response, body) {
        if (error) {
             console.log("Error " + error);
        } else {
            res.json(sapTransforms.mapConfigConfiguration(body['d']));
        }
    });
}

// Saves and updates the config
adminController.saveFields = function (req, res) {
    var configRequest = {
        Appid: req.body.appId,
        Default: true,
        Defaultconfig: true,
        ConfigSave: true,
        Indicator: req.body.configId ? 'U' : 'I',
        Roleid: 'DEVELOPER',
        Userrole: 'DEVELOPER',
        Userroleid: 'DEVELOPER',
        Appname: req.body.appName,
        Configid: req.body.configId,
        Configname: req.body.configName,
        UserSave: false,
        Nav_AppToFields: [],
        Nav_DefaultFields: req.body.defaultFields,
        Nav_TableData: [],
        Nav_LongText: [],
        Nav_AppfieldToMessages: []
    };
    configRequest.Nav_AppToFields = sapTransforms.parseRequest(req.body, configRequest.Indicator);
    configRequest.Nav_TableData = sapTransforms.parseSectionTabTablesRequest(req.body, configRequest.Indicator);
    //configRequest.Nav_LongText = sapTransforms.parseSectionTabTablesRequest(req.body, configRequest.Indicator, true);
    // fs.writeFile("./sample1.txt", JSON.stringify(configRequest), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    // });
    httpHelpers.makePostRequest('sap', 'saveConfig', configRequest, function (error, response, body) {
        if (error) {
            // console.log("Error " + error);
        } else {
           res.json(response);
        }
    });
}

// Deletes the config
adminController.deleteConfig = function (req, res) {
    var configRequest = {
        Appid: req.body.appId,
        Default: true,
        Defaultconfig: true,
        ConfigSave: true,
        Indicator: 'D',
        Roleid: 'DEVELOPER',
        Userrole: 'DEVELOPER',
        Userroleid: 'DEVELOPER',
        Appname: '',
        Configid: req.body.configId,
        Configname: req.body.configName,
        UserSave: false,
        Nav_AppToFields: []
    };
    httpHelpers.makePostRequest('sap', 'saveConfig', configRequest, function (error, response, body) {
        if (error) {
            // console.log("Error " + error);
        } else {
           res.json(response);
        }
    });
}

// Retrives the config based on Appid and Config ID
adminController.retreiveConfigDetails = function (req, res) {
    urlConfig.sap.getConfig.convertedURL = urlConfig.sap.getConfig.url + "'" + req.params.appId + "' and Configid eq '" + req.params.configId + "'" + urlConfig.sap.getConfig.subUrl;
    httpHelpers.makeGetRequest('sap', 'getConfig', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            // fs.writeFile("./sample.txt", JSON.stringify(body), function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            // });
            var configData = sapTransforms.mapConfigConfiguration(JSON.parse(body)['d']['results'][0], JSON.parse(body)['d']['results'][0]['Configname'], false, true);
            res.json(
                {
                    'data': configData.data,
                    'dropdownList': configData.dropdownList,
                    'dependentList': sapTransforms.mapAppDependentList(JSON.parse(body)['d']['results'][0]['Nav_DefaultFields']['results']).dependentList
                }
            );
        }
    });
}

module.exports = adminController;