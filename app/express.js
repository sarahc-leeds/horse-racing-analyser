// Create express app 

var express = require('express');
var app = express();

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/load-todays-racecards', function(req, res) {
    res.send('Welcome to Express');
});