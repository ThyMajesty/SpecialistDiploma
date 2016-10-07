var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    jscs = require('gulp-jscs'),
    mainBowerFiles = require('main-bower-files'),
    order = require('gulp-order'),
    pipe = require('gulp-pipe'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    buildPath = require('./build-path')
    ;

var args = {
    w: false
};

function getParams() {
    for (var a in args) {
        if(args.hasOwnProperty()){
            args[a] = gutil.env[a]
        }
    }
}
getParams();

var bowerDest = './bower.json',
    buildDest = '../static/',
    vendorsDest = buildPath('./bower_components/', 'vendors'),
    userDest = buildPath('./src/', 'user')
    ;

gulp.task('js:user', function () {
    gulp.src(userDest['js'])
        .pipe(gulpif(args.w, watch(userDest['js'])))
        .pipe(concat('user.js'))
        .pipe(gulp.dest(buildDest));
});

gulp.task('css:user', function () {
    gulp.src(userDest['css'])
        .pipe(gulpif(args.w, watch(userDest['css'])))
        .pipe(less())
        .pipe(concat('user.css'))
        .pipe(gulp.dest(buildDest));
});

gulp.task('js:vendors', function () {
    gulp.src(vendorsDest['js'])
        .pipe(gulpif(args.w, watch(vendorsDest['js'])))
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(buildDest));
});

gulp.task('css:vendors', function () {
    gulp.src(vendorsDest['css'])
        .pipe(gulpif(args.w, watch(vendorsDest['css'])))
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest(buildDest));
});

gulp.task('js', ['js:vendors', 'js:user']);
gulp.task('css', ['css:vendors', 'css:user']);

gulp.task('default', ['js', 'css'], function () {

});

/*gulp.task('watch', function () {
    watch(userDest['js'], function () {
        gulp.start('js:user');
    });
    watch(userDest['css'], function () {
        gulp.start('css:user');
    });
});*/




/*gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('somename', function () {
    console.log('somename task')
});

gulp.task('development', function () {
    return gulp.src('./main.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./out'));
});

gulp.task('default', function () {
    return gulp.src('./main.css')
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});

gulp.task('development', function () {
    return gulp.src('./main.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./out'));
});

gulp.task('javascript', function () {
    gulp.src(['src/test.js', 'src/testdir/test2.js'], {
            base: 'src'
        })
        .pipe(sourcemaps.init())
        .pipe(plugin1())
        .pipe(plugin2())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dist'));
});
*/
//gulp.task('stream', function () {
//    return watch('css/**/*.css', {
//            ignoreInitial: false
//        })
//        .pipe(gulp.dest('build'));
//});

//gulp.task('callback', function () {
// Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
//    return watch('css/**/*.css', function () {
//        gulp.src('css/**/*.css')
//            .pipe(gulp.dest('build'));
//    });
//});

/*gulp.task('default', () => {
    return gulp.src('src/app.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('default', () => {
    return gulp.src('src/app.js')
        .pipe(jscs({fix: true}))
        .pipe(gulp.dest('src'));
});*/