var fs = require('fs');

var autoprefixer = require('autoprefixer')({ browsers: ['last 3 version'] }),
    insertcss = require('insert-css');

var normalize = require('normalize-css'),
    main = fs.readFileSync(__dirname + '/main.css');

var prefixed_css = autoprefixer.process(main.toString()).css;
if (process.browser){
    insertcss(prefixed_css);
}
module.exports = prefixed_css
