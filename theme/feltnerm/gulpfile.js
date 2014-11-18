var path = require('path');

var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin');

var ROOT = './',
    ROOT_STATIC = path.join(ROOT, 'static') ;

var CONFIG = {
    css: path.join(ROOT_STATIC, 'css'),
    js: path.join(ROOT_STATIC, 'js'),
    vendor_css: path.join(ROOT_STATIC, 'vendor')
};

gulp.task('default', function(){
    console.log(CONFIG);
});
