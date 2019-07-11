var express = require('express');
var router = express.Router();
var admincontroller = require('../../controllers/admin');

router.get('/dashboard/:appId', admincontroller.dashboard);
router.get('/metadata', admincontroller.getMetaData);
router.get('/appDependentData/:appId', admincontroller.getAppDependentData);
router.post('/saveConfigFields', admincontroller.saveFields);
router.post('/deleteConfig', admincontroller.deleteConfig);
router.post('/configfields', admincontroller.getConfigfields);
router.get('/retreiveConfigDetails/:appId/:configId', admincontroller.retreiveConfigDetails);
module.exports = router;