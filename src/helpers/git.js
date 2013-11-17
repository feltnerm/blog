"use strict";
var execSync = require('exec-sync');

module.exports.register = function(Handlebars, options, params) {

    Handlebars.registerHelper('add_date', function(path) {
        return execSync("git log --follow --pretty='%cd' -- " + path + " | tail -n 1");
    });

    Handlebars.registerHelper('edit_date', function(path) {
        return execSync("git log --pretty='%cd' -- " + path + " | head -n 1");
    });

    Handlebars.registerHelper('add_sha', function(path) {
        return execSync("git log --pretty='%h' -- " + path + " | tail -n 1");
    });

    Handlebars.registerHelper('edit_sha', function(path) {
        return execSync("git log --pretty='%h' -- " + path + " | head -n 1");
    });

};
