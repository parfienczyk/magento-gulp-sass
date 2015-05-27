/**
 *  CONFIG
 */

var skinDir = './skin/frontend/rwd/parfienczyk';
var appDir  = './app/design/frontend/rwd/parfienczyk';
var host    = '';


/**
 * Required modules (pulled in from package.json file by doing
 * 'npm install' from the command line)
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');

// Static server
// use default task to launch BrowserSync and watch JS files
gulp.task('serve', ['js', 'sass'], function () {

    // Serve files from the root of this project
    browserSync({
        notify: false,
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(skinDir + '/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch([skinDir + '/js/**/*.js', '!' + skinDir + '/js/**/*.min.js' ], ['js', 'jshint']).on('change', browserSync.reload);
});


// SASS (minify + autoprefixer)
gulp.task('sass', function () {
    gulp.src(skinDir + '/scss/**/*.scss')
        .pipe(sass()).on('error', gutil.log)
        .pipe(minifyCSS())
        .pipe(postcss([autoprefixer({browsers: ['last 10 version']})])).on('error', gutil.log)
        .pipe(gulp.dest(skinDir + '/css')).on('error', gutil.log)
});

// Pass our js through browserify
gulp.task('js', ['jshint'], function () {
    gulp.src([skinDir + '/js/*.js', '!' + skinDir + '/js/**/*.min.js'])
        .pipe(browserify()).on('error', gutil.log)
        .pipe(gulp.dest(skinDir + '/build/js/'))
});

// Configure the JShint task
gulp.task('jshint', function () {
    return gulp.src([skinDir + '/js/**/*.js', '!'+skinDir + '/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Optimize all images
gulp.task('images', function () {
    return gulp.src(skinDir + '/images/**/*.{png,jpg,gif}')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(skinDir + '/images'));
});

/**
 * Set up our watcher tasks. This in turn will fire off the associated tasks
 * when it sees a file has been changed.
 */
gulp.task('watch', function () {
    
    gulp.watch(skinDir + '/scss/**/*.scss', ['sass']);
    gulp.watch([skinDir + '/js/**/*.js', '!' + skinDir + '/js/**/*.min.js' ], ['js', 'jshint']);

    // // reload browser
    // gulp.watch([
    //     skinDir + '/css/**/*.*',
    //     skinDir + '/js/**/*.*',
    //     skinDir + '/images/**/*.*',
    //     appDir + '/template/**/*.phtml',
    //     appDir + '/layout/**/*.xml'
    // ]).on('change', function (file) {
    //     livereload.changed(file.path);
    // })
});

/**
 * Set a default task. This allows us to run 'gulp' from the command line and it will
 * assume we want to run the watch task. Otherwise we would have to run 'gulp watch'
 */
gulp.task('default', ['sass', 'jshint', 'js']);
