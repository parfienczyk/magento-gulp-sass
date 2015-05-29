/**
 *  Configuration
 */
var SKIN_DIR    = './skin/frontend/rwd/par';
var APP_DIR     = './app/design/frontend/rwd/wsnyc';
var HOST_URL    = 'http://YOUR_HOST_URL.local/';   // e.g.: http://magento-store-1.local

/**
 * Required modules (pulled in from package.json file by doing
 * 'npm install' from the command line)
 */

var autoprefixer = require('autoprefixer-core');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');



// Launch web server
gulp.task('connect', function () {
    // Serve files from the root of this project
    browserSync({
        notify: false,
        proxy: HOST_URL
        // logLevel: 'debug',
        // logConnections: true,
        //server: {
        //    baseDir: "./"
        //}
    });
});


// Static server
// use default task to launch BrowserSync and watch files
gulp.task('serve', ['sass', 'connect'], function () {

    // Set up our watcher tasks. This in turn will fire off the associated
    // tasks when it sees a file has been changed.
    gulp.watch(SKIN_DIR + '/scss/**/*.scss', ['sass']);
    gulp.watch(SKIN_DIR + '/js/*.js', ['js']);
    gulp.watch(SKIN_DIR + '/images/*.*', ['images']);

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(APP_DIR + '/template/**/*.phtml').on('change', reload);
    gulp.watch(APP_DIR + '/layout/**/*.xml').on('change', reload);
});


// SASS (minify + autoprefixer)
gulp.task('sass', function () {
    gulp.src(SKIN_DIR + '/scss/**/*.scss')
        .pipe(sass()).on('error', gutil.log)
        .pipe(minifyCSS())
        .pipe(postcss([autoprefixer({browsers: ['last 10 version']})])).on('error', gutil.log)
        .pipe(gulp.dest(SKIN_DIR + '/css')).on('error', gutil.log)
        .pipe(reload({stream: true}));
});


// Pass our js through browserify
gulp.task('js', ['jshint'], function () {
    gulp.src([
            SKIN_DIR + '/js/custom.js',     // e.g.: *.js, **/*.js
            '!' + SKIN_DIR + '/js/*.min.js'
        ])
        //.pipe(browserify()).on('error', gutil.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(SKIN_DIR + '/js/'))
        .pipe(reload({stream:true}));
});


// Configure the JShint task
gulp.task('jshint', function () {
    gulp.src([SKIN_DIR + '/js/*.js', '!' + SKIN_DIR + '/js/*.min.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Optimize all images
gulp.task('images', function () {
    gulp.src(SKIN_DIR + '/images/**/*.{png,jpg,gif}')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(SKIN_DIR + '/images'));
});


// Initialization
gulp.task('init', ['sass', 'jshint', 'js']);

gulp.task('default', function() {
    console.log('To start using the package, use "$ gulp init"');
    console.log('To resume Sass\'s "watch" tasks, use "$ gulp serve"');
});