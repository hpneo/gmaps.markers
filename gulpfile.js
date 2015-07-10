var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require("vinyl-source-stream"),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('jshint', function() {
  return gulp.src('gmaps.markers.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function() {
  return gulp.src('gmaps.markers.js')
    .pipe(jscs());
});

gulp.task('browserify', function(){
  var browserifyBundler = browserify();
  
  browserifyBundler.add('./gmaps.markers.js');
  
  return browserifyBundler.bundle()
    .pipe(source('./gmaps.markers.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('browserify:test', function(){
  var browserifyBundler = browserify();
  
  browserifyBundler.add('../gmaps.core/gmaps.core.js');
  browserifyBundler.add('../gmaps.events/gmaps.events.js');
  browserifyBundler.add('./gmaps.markers.js');
  
  return browserifyBundler.bundle()
    .pipe(source('./gmaps.markers.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function() {
  return gulp.src('./dist/gmaps.markers.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
  return gulp.src('./test/runner.html')
    .pipe(mochaPhantomJS());
});

gulp.task('default', [ 'jshint', 'jscs', 'browserify:test', 'test' ]);
gulp.task('dist', [ 'jshint', 'jscs', 'browserify', 'uglify' ]);