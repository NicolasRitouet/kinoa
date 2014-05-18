// Include gulp
var gulp    = require('gulp'); 

// Include Our Plugins
var jshint  = require('gulp-jshint');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var rev     = require('gulp-rev');
var ngmin   = require('gulp-ngmin');
var shell   = require('gulp-shell');
var nodemon = require('gulp-nodemon');
var open    = require("gulp-open");

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
    gulp.watch('./public/app/**/*.js', ['lint', 'js']);
    // gulp.watch('scss/*.scss', ['sass']);
});

// start mongodb
gulp.task('mongodb', shell.task([
  'echo "start mongodb"',
  'mongod'
]));

// start deployd
gulp.task('server', function () {
  nodemon({ script: 'index.js', ext: 'html js', ignore: ['./public/**'],  })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    });
});

// open browser
gulp.task('open', function() {
  var options = {
    url: "http://localhost:3000"
  };
  gulp.src("./index.html")
    .pipe(open("", options));
});

/* DEFAULT TASK */
gulp.task('default', ['lint', 'js', 'watch', 'mongodb', 'server', 'open']);