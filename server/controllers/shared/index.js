var httpHelpers = require('../../helpers/http-helpers');
var sapTransforms = require('../../helpers/sap-tranforms');
var urlConfig = require('../../configs/url-configs');
var sharedController = {};
var fs = require("fs");

// Retrivies the drop down master values
sharedController.getDropDownList = function (req, res) {
    httpHelpers.makeGetRequest('sap', 'dropdown', function (error, response, body) {
        if (error) {
            console.log("Error " + error);
        } else {     
            fs.readFile("./DDValues.txt", "utf8", function(err, data) {
                if(err) {
                    return console.log(err);
                }
                res.json(sapTransforms.mapDropdownValues(JSON.parse(data)['d']['results'][0]['Nav_AppToFields']['results']));
            });   
            // var dropdownValues = sapTransforms.mapDropdownValues(JSON.parse(body)['d']['results'][0]['Nav_AppToFields']['results']);
            // res.json(dropdownValues);
        }
    });
}

module.exports = sharedController;
