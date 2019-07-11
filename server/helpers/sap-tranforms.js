var fs = require("fs");
var sapTransforms = {},
    _ = require('lodash');

sapTransforms.mapAppIds = function (appList) {
    var response = {
        data: {
            roles: [{
                roleId: 'r57uj',
                roleName: 'Sales Representative'
            }, {
                roleId: 'r58uj',
                roleName: 'Master Data Governor'
            }, {
                roleId: 'r98ji',
                roleName: 'Production Excutive'
            }, {
                roleId: 'r98ui',
                roleName: 'Senior Sales Representative'
            }],
            apps: []
        }
    }
    appList.forEach(element => {
        var obj = {};
        obj['appId'] = element['Appid'];
        obj['appName'] = element['AppName'];
        response.data.apps.push(obj);
    });
    return response;
}

sapTransforms.mapAppDetails = function (appDetails) {
    var response = {
        views: []
    };

    appDetails.forEach(element => {
        var obj = {};
        obj['appId'] = element['Appid'];
        obj['appName'] = element['Appname'];
        obj['configId'] = element['Configid'];
        obj['configName'] = element['Configname'];
        obj['userRoleId'] = 'r58uj'; // element['UserRole'];
        obj['userRole'] = 'Master Data Governor'; // element['UserRoleName'];
        obj['createdByID'] = element['Createdby'];
        obj['createdBy'] = element['Createdby'];
        obj['creationDate'] = element['Createdon'];
        response.views.push(obj);
    });
    return response;
}

sapTransforms.mapConfigDetails = function (configDetails, configName = '', newConfig = false) {
    var response = {
        data: {}
    };
    const filterSections = _.filter(configDetails, function (configData) {
        return configData.Sectionid !== '';
    });
    const filterTabs = _.filter(configDetails, function (configData) {
        return configData.Sectionid === '' && configData.Tabid !== '';
    });
    const filterFields = _.filter(configDetails, function (configData) {
        return configData.Table === false && configData.Tabid === '' && configData.Sectionid === '';
    });
    response.data.appId = _.get(_.find(configDetails, 'Appid'), 'Appid');
    response.data.configId = _.get(_.find(configDetails, 'Configid'), 'Configid');
    response.data.configName = configName;
    response.data.accordions = prepareAccordionsConfig(filterSections, newConfig);
    response.data.tabs = prepareTabsConfig(filterTabs);
    response.data.fields = mapConfigFields(filterFields);
    return response;
}

sapTransforms.saveConfigDetails = function (body) {
}

sapTransforms.mapAppDependentList = function (appDependentDetails) {
    var response = {
        dependentList: []
    };

    appDependentDetails.forEach(element => {
        var obj = {};
        obj['fieldId'] = element['Fieldid'];
        obj['fieldName'] = element['Fieldname'];
        obj['required'] = element['Required'] ? element['Required'] : false;
        obj['fieldValue'] = element['Fieldvalue'] ? element['Fieldvalue'] : '';
        obj['keyField'] = element['Keyfield'] ? element['Keyfield'] : false;
        obj['keyValues'] = [];
        if (element['Nav_ValueList'] && element['Nav_ValueList']['results']) {
            var ddnValues = element['Nav_ValueList']['results'];
            ddnValues.forEach(ddnValue => {
                var ddnObj = {};
                ddnObj['code'] = ddnValue['Key'];
                ddnObj['value'] = ddnValue['Value'];
                obj.keyValues.push(ddnObj);
            });
        }
        response.dependentList.push(obj);
    });
    return response;
}

sapTransforms.mapDropdownValues = function (fieldsList) {
    var response = {
        dropdownNav: []
    };
    fieldsList.forEach(fieldList => {
        var obj = {};
        obj.fieldName = fieldList['Fieldname'];
        obj.appId = fieldList['Appid'];
        obj.dropdowns = [];
        if (fieldList['Nav_FieldToDdvalues'] && fieldList['Nav_FieldToDdvalues']['results'] && fieldList['Nav_FieldToDdvalues']['results'].length > 0) {
            fieldList['Nav_FieldToDdvalues']['results'].forEach(element => {
                var ddnObj = {};
                ddnObj['key'] = element['Key'];
                ddnObj['value'] = element['Value'];
                obj.dropdowns.push(ddnObj);
            });
        }
        response.dropdownNav.push(obj);
    });
    return response;
}

function prepareAccordionsConfig(filteredAccordions, newConfig = false) {
    return _.chain(filteredAccordions)
        .groupBy('Sectionid')
        .map((fields, sectionId) => ({
            sectionId,
            sectionName: _.get(_.find(fields, 'Sectionname'), 'Sectionname'),
            collapsable: filteredAccordions[0]['Isexpandable'],
            collapsed: _.get(_.find(fields, 'Isexpanded'), 'Isexpanded'),
            fields: mapConfigFields(fields, newConfig)
        }))
        .value();
}

function prepareTabsConfig(filteredTabs) {
    return _.chain(filteredTabs)
        .groupBy('Tabid')
        .map((fields, tabId) => ({
            tabId,
            tabName: _.get(_.find(fields, 'TabName'), 'TabName'),
            active: true,
            accordions: filterSectionsFromTabs(fields),
            fields: filterFieldsFromTabs(fields)
        }))
        .value();
}

function filterSectionsFromTabs(tabFields) {
    const filteredSections = _.filter(tabFields, function (configData) {
        return configData.Sectionname !== '';
    });

    return prepareAccordionsConfig(filteredSections);
}

function filterFieldsFromTabs(tabFields) {
    const filteredSections = _.filter(tabFields, function (configData) {
        return configData.Sectionname === '';
    });

    return mapConfigFields(filteredSections);
}

function mapConfigFields(appFields, newConfig = false) {
    var response = [];
    appFields.forEach(element => {
        var obj = {};
        obj['hidden'] = element['Hiden'];
        obj['required'] = element['Required'];
        obj['sectionSapName'] = element['Sectionsapname'];
        obj['optional'] =  element['Hiden'] ? false : (element['Required'] ? true : newConfig ? !element['Optional'] : element['Optional']);
        obj['displayName'] = element['Fieldlabel'];
        obj['userRole'] = element['Userrole'];
        obj['fieldName'] = element['Fieldname'];
        obj['fieldValue'] = element['FieldValue'];
        obj['selected'] = element['Selected'];
        obj['dataType'] = element['Datatype'];
        obj['fieldType'] = (element['Fieldtype'] === '' || element['Fieldtype'] === 'C') ? (element['Datatype'] === '' ? 'C' : element['Datatype'] ) : element['Fieldtype'];
        obj['length'] = element['Leng'];
        obj['sequence'] = element['Sequence'];
        obj['configSave'] = element['Configsave'];
        obj['sectionsapname'] = element['Sectionsapname'];
        response.push(obj);
    });
    return response;
}

sapTransforms.parseRequest = function (request, Indicator) {
    var parsedData = [];
    const commonData = {
        appId: request.appId,
        configId: request.configId
    }
    if (request.accordions && request.accordions.length) {
        parsedData = mergeArray(parsedData, parseAccordions(request.accordions, commonData, Indicator));
    }
    if (request.tabs && request.tabs.length) {
        parsedData = mergeArray(parsedData, parseTabs(request.tabs, commonData, Indicator));
    }
    if (request.fields && request.fields.length) {
        parsedData = mergeArray(parsedData, parseFields(request.fields, commonData, Indicator));
    }
    return parsedData;
}

sapTransforms.prepareWorkItemsList = function (workItemList) {
    var response = {
        workItemList: []
    };

    workItemList.forEach(element => {
        var obj = {};
        obj['workitemId'] = element['WorkitemId'];
        obj['createdOn'] = element['CreatedOn'];
        obj['createdBy'] = element['CreatedBy'];
        obj['keyId'] = element['KeyId'];
        response['workItemList'].push(obj);
    });
    return response;
}

function mergeArray(targetArray, srcArray) {
    if (targetArray.length) {
        return _.concat(targetArray, srcArray);
    } else {
        return srcArray;
    }
}

function parseAccordions(accordions, commonData, Indicator) {
    const parsedAccordionsData = [];
    _.forEach(accordions, function (value, key) {
        const parsedAccordionObj = {
            Appid: commonData.appId,
            Table: '',
            Tabid: '',
            Tabname: '',
            Configid: commonData.configId,
            Sectionid: value.sectionId,
            Sectionname: value.sectionName,
            Isexpanded: value.collapsed,
            Isexpandable: value.collapsable,
            // Indicator: Indicator
        };
        _.forEach(value.fields, function (val) {
            parsedAccordionsData.push(_.cloneDeep(parseCommonFields(parsedAccordionObj, val, Indicator)));
        });
    });
    return parsedAccordionsData;
}

function parseTabs(tabs, commonData) {
    const parsedTabsData = [];
    _.forEach(tabs, function (value, key) {
        const parsedTabsObj = {
            Appid: commonData.appId,
            Table: '',
            Tabid: value.tabId,
            Tabname: value.tabName,
            Configid: commonData.configId
        };
        if (value.accordions && value.accordions.length) {
            _.forEach(value.accordions, function (accordionVal, key) {
                parsedTabsObj.Sectionid = accordionVal.sectionId;
                parsedTabsObj.Sectionname = accordionVal.sectionName;
                _.forEach(accordionVal.fields, function (tabVal) {
                    parsedTabsData.push(_.cloneDeep(parseCommonFields(parsedTabsObj, tabVal)));
                });
            });
        }
        if (value.fields && value.fields.length) {
            parsedTabsObj.Sectionid = '';
            parsedTabsObj.Sectionname = '';
            _.forEach(value.fields, function (val) {
                parsedTabsData.push(_.cloneDeep(parseCommonFields(parsedTabsObj, val)));
            });
        }
    });
    return parsedTabsData;
}

function parseFields(fields, commonData) {
    const parsedFieldsData = [];
    _.forEach(fields, function (value, key) {
        const parsedFieldObj = {
            Appid: commonData.appId,
            Table: '',
            Tabid: '',
            Tabname: '',
            Configid: commonData.configId,
            Sectionid: '',
            Sectionname: '',
            Indicator: Indicator
        };
        parsedFieldsData.push(_.cloneDeep(parseCommonFields(parsedFieldObj, value)));
    });
    return parsedFieldsData;
}

function parseCommonFields(parentObj, fields, Indicator) {
    parentObj.Hiden = fields.hidden;
    parentObj.Optional = fields.optional;
    parentObj.Sequence = fields.sequence;
    parentObj.Fieldlabel = fields.displayName;
    parentObj.Fieldtype = fields.fieldType;
    parentObj.Fieldname = fields.fieldName;
    parentObj['FieldValue'] = fields.fieldValue;
    parentObj.Required = fields.required;
    parentObj.Parentname = '';
    parentObj.Table = false;
    // parentObj.Selected = fields.selected;
    parentObj.Datatype = fields.dataType;
    parentObj.Leng = fields.length;
    parentObj.Sectionsapname = fields.sectionsapname;
    // parentObj.Indicator = Indicator;
    return parentObj;
}

module.exports = sapTransforms;
