var path = require('path');

var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    browserify = require('browserify');

var ROOT = './',
    ROOT_STATIC = path.join(ROOT, 'static') ;

gulp.task('css', function(){
});

gulp.task('js', function(){
});

gulp.task('default', function(){
    console.log(CONFIG);
});
