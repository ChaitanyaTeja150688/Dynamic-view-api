var httpHelpers = require('../../helpers/http-helpers');
var sapTransforms = require('../../helpers/sap-tranforms');
var urlConfig = require('../../configs/url-configs');
var fs = require("fs");
var userController = {};

// Save and update of config and generates Work item ID
userController.userSaveConfig = function (req, res) {
    var configRequest = {
        Appid: req.body.appId,
        Default: false,
        Defaultconfig: false,
        ConfigSave: false,
        Indicator: req.body.WorkItemidInd ? 'U' : 'I',
        Roleid: 'DEVELOPER',
        Userrole: 'DEVELOPER',
        Userroleid: 'DEVELOPER',
        Appname: req.body.appName,
        Configid: req.body.configId,
        Configname: req.body.configName,
        UserSave: true,
        ScenarioInd: 'C',
        WorkItemidInd: req.body.WorkItemidInd,
        KeyfieldInd: '',
        Nav_AppToFields: [],
        Nav_AppfieldToMessages: [],
        Nav_DefaultFields: req.body.defaultFields
    };
    configRequest.Nav_AppToFields = sapTransforms.parseRequest(req.body, configRequest.Indicator);
    fs.writeFile("./sample2.txt", JSON.stringify(configRequest), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    httpHelpers.makePostRequest('sap', 'userSaveConfig', configRequest, function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
           res.json(response);
        }
    });
}

// Retrivies Work item ID's list based on AppID and ConfigID
userController.getUserWorkItemList = function(req, res) {
    urlConfig.sap.getWorkItemDetails.convertedURL = urlConfig.sap.getWorkItemDetails.url + "'" + req.params.workItemId + "'&";
    httpHelpers.makeGetRequest('sap', 'getWorkItemDetails', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            res.json(sapTransforms.prepareWorkItemsList(JSON.parse(body)['d']['results']));
        }
    });
}

// Retrivies Saved Work item ID data based on Work Item Id
userController.getUserWorkItemDetails = function(req, res) {
    urlConfig.sap.UserWorkItemData.convertedURL = urlConfig.sap.UserWorkItemData.url + "'" + req.params.workItemId + urlConfig.sap.UserWorkItemData.subUrl;
    httpHelpers.makeGetRequest('sap', 'UserWorkItemData', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            var filteredArray = JSON.parse(body)['d']['results'][0]['Nav_AppToFields']['results'];
            res.json({data: sapTransforms.mapConfigDetails(filteredArray, JSON.parse(body)['d']['results'][0]['Configname']).data});
        }
    });
}

// Retrivies Saved Work item ID data based on Work Item Id
userController.getUserMaterialDetails = function(req, res) {
    urlConfig.sap.UserMaterialData.convertedURL = urlConfig.sap.UserMaterialData.url + "'" + req.params.materialId + urlConfig.sap.UserMaterialData.subUrl;
    httpHelpers.makeGetRequest('sap', 'UserMaterialData', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            var filteredArray = JSON.parse(body)['d']['results'][0]['Nav_AppToFields']['results'];
            res.json({data: sapTransforms.mapConfigDetails(filteredArray, JSON.parse(body)['d']['results'][0]['Configname']).data});
        }
    });
}

module.exports = userController;