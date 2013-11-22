    "use strict";
    var execSync = require('exec-sync'),
        moment = require('moment');

module.exports.register = function(Handlebars, options, params) {

    Handlebars.registerHelper('add_date', function(path, format) {
        var commit_date = execSync("git log --follow --pretty='%cd' -- " + path + " | tail -n 1");
        if (format) {
            return moment(commit_date).format(format);
        }
        return moment(commit_date).toISOString();
    });

    Handlebars.registerHelper('edit_date', function(path, format) {
        var commit_date = execSync("git log --follow --pretty='%cd' -- " + path + " | head -n 1");
        if (format) return moment(commit_date).format(format);
        return moment(commit_date).toISOString();
    });

    Handlebars.registerHelper('add_sha', function(path) {
        return execSync("git log --follow --pretty='%h' -- " + path + " | tail -n 1");
    });

    Handlebars.registerHelper('edit_sha', function(path) {
        return execSync("git log --follow --pretty='%h' -- " + path + " | head -n 1");
    });

};
