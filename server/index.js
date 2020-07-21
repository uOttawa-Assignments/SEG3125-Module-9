const express = require("express");
const app = express(); // create express app
const path = require("path");
const bodyParser = require('body-parser');

var controller = require('./controller');

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({extended: true}));

// start controller
controller(app);

// start express server on port 3000
app.listen(3000, () => {
  console.log("server started on port 3000");
});