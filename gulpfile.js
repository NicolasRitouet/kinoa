'use strict';
// Include gulp
var gulp    = require('gulp');

// Include Our Plugins
var jshint  = require('gulp-jshint');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var ngmin   = require('gulp-ng-annotate');
var shell   = require('gulp-shell');
var nodemon = require('gulp-nodemon');
var openAfterStart    = require('gulp-open');
var Server  = require('karma').Server;

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./public/app/**/*.js')
        //.pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src('./public/app/**/*.js')
        .pipe(concat('kinoa.js'))
        .pipe(gulp.dest('./public/dist'))
        .pipe(rename('kinoa.min.js'))
        .pipe(ngmin())
        .pipe(uglify())
        //.pipe(gulp.dest('./dist'))
        //.pipe(rev())
        //.pipe(gulp.dest('./dist'))
        //.pipe(rev.manifest())
        .pipe(gulp.dest('./public/dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    return gulp.watch('./public/app/**/*.js', ['lint', 'js']);
    // gulp.watch('scss/*.scss', ['sass']);
});

// start mongodb
gulp.task('mongodb', function() {
    return gulp.src('')
        .pipe(shell([
          'exec scripts/startMongodb.sh'
        ]));
});

// start deployd
gulp.task('server', function () {
  return nodemon({ script: 'index.js', ext: 'html js', ignore: ['./public/**']  })
    .on('change', ['lint']);
});

// open browser
gulp.task('open', function() {
  var options = {
    url: 'http://localhost:3000'
  };
  return gulp.src('./public/index.html')
    .pipe(openAfterStart('', options));
});

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/* DEFAULT TASK */
gulp.task('default', ['lint', 'js', 'watch', 'mongodb', 'server', 'open']);
