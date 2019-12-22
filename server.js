'use strict';

let express = require('express');
let router = require('./router');

let app = express();
let port = 3000;

// EJS template engine
app.set('view engine', 'ejs');
// serve static content
app.use('/static', express.static('static'));
// Parse form submissions from browser
app.use(express.urlencoded({ extended: true }));
// accept JSON
app.use(express.json());
// Middleware routes
app.use(router);

// Error handler
app.use(function (req, res, next, error) {
    console.error(error);
});

app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});