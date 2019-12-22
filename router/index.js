'use strict';

let express = require('express');
let db = require('./db/db');
let fs = require('fs');
let path = require('path');

let router = express.Router();
/*
// Home page
router.get('/', function (req, res) {
    res.render('home', {
       pageId: 'home',
       title: 'Home'
    });
});

// Home page
router.get('/register', function (req, res) {
    res.render('register', {
       pageId: 'register',
       title: 'Register'
    });
});

// Login
router.get('/login', function (req, res) {
    res.render('login', {
       pageId: 'login',
       title: 'Login'
    });
});

// Home page
router.get('/contact', function (req, res) {
    res.render('contact', {
       pageId: 'contact',
       title: 'Contact'
    });
});
*/

router.get('/listAll', function(req, res){
    fs.readFile('./router/db/contact.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    })
})

router.post('/register', async function (req, res) {
    await db.register(req.body);
    res.status(201).send('User has been registered!');
});

router.post('/form', async function (req, res, next) {
    // validate to ensure all fields are filled out in the form
    const formErrors = {};
    if (!req.body.name) {
        formErrors.name = 'Required';
    }
    if (!req.body.email) {
        formErrors.email = 'Required';
    }
    if (!req.body.number) {
        formErrors.number = 'Required';
    }

    if (!formErrors.email) {
        try {
            const exists = await db.emailExists(req.body.email);
            if (exists) formErrors.global = 'This email has already been used.';
            res.status(409).send('Email used!');
            return;
        } catch (error) {
            next(error);
            return; // stops running function
        }
    }

    // If invalid... will need to rerender the page
    if (Object.keys(formErrors).length) {
        res
            .status(404)
    } else { // if no error, submit the form, send the status code
        try {
            await db.formSubmit({
                ...req.body
            });
            res.status(201).send('Form submitted!');
        } catch (error) {
            next(error);
        }
    }

});

module.exports = router;