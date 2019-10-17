var httpHelpers = require('../../helpers/http-helpers');
var sapTransforms = require('../../helpers/sap-tranforms');
var urlConfig = require('../../configs/url-configs');
var sharedController = {};
var fs = require("fs");

// Retrivies the drop down master values
sharedController.getDropDownList = function (req, res) {
    const object = {
        Appid: "BUS1001006",
        Configid: "",
        Nav_AppIDInfoH_AppIDInfo: req.body
    }
    httpHelpers.makePostRequest('sap', 'dropdown', object, function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {
            res.json(sapTransforms.mapDropdownValues(body['d']['Nav_AppIDInfoH_AppIDInfo']['results']));
        }
    });
}

module.exports = sharedController;
