'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import chalk from 'chalk';
import del from 'del';
import gutil from 'gulp-util';

let runSequence = require('run-sequence').use(gulp);
let $ = gulpLoadPlugins();

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
let IS_DEV = require('yargs').argv.dev || false;    // check if dev env

// ----------------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------------
const HOST_URL = 'http://YOUR_LOCAL_VHOST.LINK';
const root = './skin/frontend/rwd/parfienczyk';
const PATHS = {
    dist: `${root}/dist`,
    tmp: '.tmp/',
    scripts: [`${root}/src/js/**/*.js`, `!${root}/src/js/**/*.spec.js`],
    tests: `${root}/src/js/**/*.spec.js`,
    styles: `${root}/src/scss/**/*.scss`,
    templates: `${root}/app/**/*.html`,
    modules: [],
    static: [
        // `${root}/index.html`,
        // `${root}/fonts/**/*`,
        `${root}/.htaccess`,
        `${root}/src/images/**/*`
    ],
    fonts: [
        `node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*.*`,
        `node_modules/font-awesome/fonts/**/*.*`
    ]
};

// ----------------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------------
gulp.task('default', ['build']);

gulp.task('build', () => runSequence('copy', 'styles', 'scripts', 'fonts'));

gulp.task('copy', ['clean'], () => {
    return gulp.src(PATHS.static)
        .pipe(gulp.dest(PATHS.dist));
});

gulp.task('clean', cb => del([`${PATHS.dist}/**/*`], cb));

gulp.task('fonts', () => {
    return gulp
        .src(PATHS.fonts)
        .pipe(gulp.dest(`${PATHS.dist}/fonts/`));
});

gulp.task('styles', () => {
    let sassOptions = {
        style: 'expanded',
        outputStyle: 'compressed',
        precision: 10
    };

    isDevMode();

    return gulp
        .src(PATHS.styles)
        .pipe($.if(IS_DEV, $.sourcemaps.init()))
        .pipe($.plumber())
        .pipe($.sass(sassOptions)).on('error', errorHandler('Sass'))
        .pipe($.autoprefixer({browsers: ['last 5 version']})).on('error', errorHandler('Autoprefixer'))
        .pipe($.if(!IS_DEV, $.csso()))
        .pipe($.if(IS_DEV, $.sourcemaps.write('.')))
        .pipe(gulp.dest(`${PATHS.dist}/css`))
        .pipe($.size({showFiles: true}))
        .pipe(browserSync.stream());
});

gulp.task('scripts', ['script:app', 'script:vendor']);

gulp.task('script:app', () => {
    isDevMode();

    let _task = gulp
        .src(PATHS.scripts)
        .pipe($.if(IS_DEV, $.sourcemaps.init()))
        .pipe($.plumber())
        .pipe($.babel())

        // original -- app.js
        .pipe($.concat('app.js'))
        .pipe($.if(IS_DEV, $.sourcemaps.write('.')))
        .pipe(gulp.dest(`${PATHS.dist}/js/`))
        .pipe($.size({showFiles: true}));

    if (!IS_DEV) {
        _task
            .pipe($.uglify())
            .pipe(gulp.dest(`${PATHS.dist}/js/`))
            .pipe($.size({showFiles: true}));
    }

    _task.pipe(browserSync.stream());

    return _task;
});

gulp.task('script:vendor', () => {

    let scripts = [
        './node_modules/jquery/dist/js/jquery.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js',
        //'src/js/script.js'
    ];

    return gulp
        .src(scripts)
        .pipe($.plumber())
        .pipe($.concat('vendors.js'))
        .pipe(gulp.dest(`${PATHS.dist}/js/`))
        .pipe($.size({showFiles: true}));
});

gulp.task('watch', () => {

    gulp.watch(PATHS.styles, ['styles']);

    gulp.watch(PATHS.scripts, ['scripts']);
});

gulp.task('serve', ['watch'], () => browserSyncInit());


// Private
// ----------------------------------------------------------------------------

function browserSyncInit(browser) {
    browser = browser || 'default';

    let options = {
        port: 3000,
        proxy: {
            target: HOST_URL
        },
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-kp',
        notify: true,
        reloadDelay: 0, //1000,
        online: true,
        browser: browser
    };

    browserSync.instance = browserSync.init(options);
}

function isDevMode() {
    if (IS_DEV) {
        console.log(chalk.bgCyan.bold('                DEV Mode                 '));
        console.log(chalk.bgCyan.bold('                                         '));
    }
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
function errorHandler(title) {
    'use strict';

    return (err) => {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    };
};