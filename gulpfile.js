//
//
// ======================================================

var SKIN_DIR    = './skin/frontend/rwd/parfienczyk';
var APP_DIR     = './app/design/frontend/rwd/parfienczyk';
var HOST_URL    = 'http://YOUR_LOCAL_VHOST.LINK/';   // e.g.: http://magento-store-1.local

// IMPORTANT: we don't why but gulp works very slow when domain is: http://some_address.local
// better solution and faster reload is when domain is: http://some_address.dev


var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();



//
// Serve
// ======================================================
gulp.task('serve', function () {
    // Serve files from the root of this project
    browserSync.init({
        notify: true,
        proxy: HOST_URL
    });

    gulp.watch(SKIN_DIR + '/src/scss/**/*.scss', ['sass']);
    gulp.watch(SKIN_DIR + '/src/js/*.js', ['js']);

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(APP_DIR + '/template/**/*.phtml').on('change', browserSync.reload);
    gulp.watch(APP_DIR + '/layout/**/*.xml').on('change', browserSync.reload);
});

//
// SASS (minify + autoprefixer)
// ======================================================
gulp.task('sass', function () {
    gulp.src(SKIN_DIR + '/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sass.sync())
        .pipe($.autoprefixer({browsers: ['last 10 version']}))
        //.pipe($.sourcemaps.init())
        .pipe($.minifyCss())
        //.pipe($.sourcemaps.write())
        .pipe(browserSync.reload({stream: true}))
        .pipe($.size({showFiles:true}))
        .pipe(gulp.dest(SKIN_DIR + '/dist/css'));
});


//
// JS::vendors
// ======================================================
gulp.task('js:vendor', function () {
    var scripts = [
        './bower_components/jquery/dist/js/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        //'src/js/script.js'
    ];

    gulp.src(scripts)
        .pipe($.plumber())
        .pipe($.concat('vendors.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(SKIN_DIR + '/dist/js'));
});


//
// JS::custom
// ======================================================
gulp.task('js:custom', function () {
    gulp.src([
            SKIN_DIR + '/src/js/custom.js'
        ])
        .pipe($.plumber())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe($.size({showFiles:true}))
        .pipe(gulp.dest(SKIN_DIR + '/dist/js/'))
        .pipe(browserSync.reload({stream: true}));
});


// Configure the JShint task
gulp.task('jshint', function () {
    gulp.src([
        SKIN_DIR + '/dist/js/custom.js',
        '!' + SKIN_DIR + '/js/custom*.min.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Fonts
gulp.task('fonts', function() {
    return gulp
        .src([
            'bower_components/bootstrap/fonts/**/*',
            'bower_components/font-awesome/fonts/**/*'
        ])
        .pipe(gulp.dest(SKIN_DIR + '/dist/fonts'));
});

// Optimize all images
gulp.task('image', function () {
    gulp.src(SKIN_DIR + '/src/images/**/*.{png,jpg,gif}')
        .pipe($.plumber())
        .pipe($.imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(SKIN_DIR + '/dist/images'));
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch(SKIN_DIR + '/src/scss/**/*.scss', ['sass']);

    // Watch .js files
    gulp.watch(SKIN_DIR + '/src/js/*.js', ['js']);

    // Watch image files
    gulp.watch(SKIN_DIR + '/src/images/**/*', ['images']);
});

// Initialization
gulp.task('dev', ['sass', 'js']);
gulp.task('prod', ['sass', 'js', 'image', 'fonts']);

gulp.task('default', function () {
    console.log('To start using the package, use "$ gulp prod"');
    console.log('To resume Sass\'s "watch" tasks, use "$ gulp serve"');
});