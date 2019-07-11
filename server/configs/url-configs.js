
const urlConfig = {
    'sap': {
        'admindashboard': {
            'url': '/AppUserRoleSet?$filter=Appid%20eq%20%27',
            'method': 'get',
            'convertedURL': ''
        },
        'metadata': {
          'url': '/AppIdsListSet?',
          'method': 'get',
          'convertedURL': '/AppIdsListSet?'
        },
        'appdependentlist': {
            'url': '/AppIdsSet?$filter=(Appid eq ',
            'subUrl': ')&$expand=Nav_DefaultFields,Nav_DefaultFields/Nav_ValueList&',
            'method': 'get',
            'convertedURL': ''
        },
        'dashboard': {
            'url': '/AppDetailsSet?$format=json',
            'method': 'get',
            'convertedURL': ''
        },
        'config': {
            'url': '/AppFieldsSet?$filter=(Appid eq',
            'subUrl': ')&$expand=Nav_AppToFields&',
            'method': 'get',
            'convertedURL': ''
        },
        'saveConfig': {
            'url': '/AppFieldsSet',
            'method': 'post',
            'convertedURL': '/AppFieldsSet'
        },
        'getConfig': {
            'url': '/AppFieldsSet?$filter=(Appid eq ',
            'subUrl': ')&$expand=Nav_AppToFields,Nav_DefaultFields&',
            'method': 'get',
            'convertedURL': ''
        },
        'getConfigFields': {
            'url': '/AppIdsSet',
            'method': 'post',
            'convertedURL': '/AppIdsSet'
        },
        'dropdown': {
            'url': '/AppFieldsSet?$expand=Nav_AppToFields,Nav_AppToFields/Nav_FieldToDdvalues&',
            'method': 'get',
            'convertedURL': '/AppFieldsSet?$expand=Nav_AppToFields,Nav_AppToFields/Nav_FieldToDdvalues&'
        },
        'userSaveConfig': {
            'url': '/AppFieldsSet',
            'method': 'post',
            'convertedURL': '/AppFieldsSet'
        },
        'getWorkItemDetails': {
            'url': '/RequestListSet?$filter=Appid eq ',
            'method': 'get',
            'convertedURL': ''
        },
        'UserWorkItemData': {
            'url': '/AppFieldsSet?$filter=WorkItemidInd eq ',
            'subUrl': "'&$expand=Nav_AppToFields&",
            'method': 'get',
            'convertedURL': ''
        },
        'UserMaterialData': {
            'url': '/AppFieldsSet?$filter=KeyfieldInd eq ',
            'subUrl': "'&$expand=Nav_AppToFields&",
            'method': 'get',
            'convertedURL': ''
        }
        
    },
    'oracle': {
    }
  };
  
module.exports = urlConfig;
