const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const dataFileName = path.resolve(__dirname, '../survey/data.json');

module.exports = function (app) {
    app.post('/data', urlEncodedParser, function (request, response) {
        let userData = request.body;
        let existingData = JSON.parse(fs.readFileSync(dataFileName));

        existingData[userData.question].results[userData.choice]++;

        fs.writeFileSync(dataFileName, JSON.stringify(existingData));
    })
    
    app.get('/data', function (request, response) {
        response.sendFile(dataFileName);
    });
};