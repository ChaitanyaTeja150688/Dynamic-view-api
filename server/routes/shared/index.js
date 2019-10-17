var express = require('express');
var router = express.Router();
var sharedController = require('../../controllers/shared');

router.post('/dropDownList', sharedController.getDropDownList);

module.exports = router;