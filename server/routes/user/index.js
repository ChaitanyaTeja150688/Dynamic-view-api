var express = require('express');
var router = express.Router();
var usercontroller = require('../../controllers/user');

router.post('/userSaveConfig', usercontroller.userSaveConfig);
router.get('/getUserWorkItemList/:workItemId', usercontroller.getUserWorkItemList);
router.get('/getUserWorkItemDetails/:workItemId', usercontroller.getUserWorkItemDetails);
router.get('/getUserMaterialDetails/:materialId', usercontroller.getUserMaterialDetails);
module.exports = router; 