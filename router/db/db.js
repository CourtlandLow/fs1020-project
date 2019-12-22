'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

let filePath = path.resolve('router/db/contact.json');

// read and return contact.json
async function read() {
    let json = await readFile(filePath);
    return JSON.parse(json);
}

// write to contact.json
async function write(dbItems) {
    let json = JSON.stringify(dbItems, null, 2);
    await writeFile(filePath, json);
}


// Submit form
async function formSubmit(form) {
    let formData = await read();
    formData.push(form);
    await write(formData);
}

// Register a user -- currently just adds to DB
async function register(user) {
    let dbContact = await read();
    dbContact.push(user);
    await write(dbContact);
}

// Checks if email exists
async function emailExists(email) {
    let emails = await read();
    return emails.some(function (emailAddress) {
        return emailAddress.email === email;
    })
}


module.exports = {
    register: register,
    formSubmit: formSubmit,
    emailExists: emailExists,
};