#!/usr/bin/env node
var browserify = require('browserify')
  , path       = require('path')
  , fs         = require('fs')
  , exorcist   = require('exorcist')
  , uglify     = require('uglify-js')
  , mapfile    = path.join(__dirname, 'static', 'bundle.js.map')

var shim = require('browserify-shim'),
    brfs = require('brfs');

browserify(require.resolve('./index'), {
    entry: true,
    debug: true,
    standalone: 'feltnerm',
})
.bundle()
.pipe(brfs())
.pipe(exorcist(mapfile, '/theme/bundle.js.map', '/theme'))
.pipe(fs.createWriteStream('./static/bundle.js'));
