var express = require('express');
var router = express.Router();
var sharedController = require('../../controllers/shared');

router.get('/dropDownList/:id', sharedController.getDropDownList);

module.exports = router;