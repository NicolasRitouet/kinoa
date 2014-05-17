// Include gulp
var gulp    = require('gulp'); 

// Include Our Plugins
var jshint  = require('gulp-jshint');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var rev     = require('gulp-rev');
var ngmin   = require('gulp-ngmin');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
    return gulp.src('./app/**/*.js')
        .pipe(concat('kinoa.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('kinoa.min.js'))
        .pipe(ngmin())
        .pipe(uglify())
        //.pipe(gulp.dest('./dist'))
        //.pipe(rev())
        //.pipe(gulp.dest('./dist'))
        //.pipe(rev.manifest())
        .pipe(gulp.dest('./dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./app/**/*.js', ['lint', 'js']);
    // gulp.watch('scss/*.scss', ['sass']);
});

/* DEFAULT TASK */
gulp.task('default', ['lint', 'js', 'watch']);