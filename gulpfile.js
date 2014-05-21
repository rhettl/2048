var gulp = require('gulp'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    filesize = require('gulp-filesize'),
    clean = require('gulp-clean'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    connect = require("gulp-connect"),
    open = require("gulp-open"),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    fs = require('fs');

var srcDir = './app',
    distDir = './dist',
    cssDir = '/styles',
    jsDir = '/js',
    verbose = false,
    production = false;

gulp.task('verbose', function () {
    verbose = true;
});
gulp.task('production', function () {
    production = true;
});

gulp.task('clean', function () {
    return gulp.src(distDir + '/*', {read: false})
        .pipe(rimraf());
});

gulp.task('css', ['clean'], function () {
    gulp.src(srcDir + cssDir + '/main.less')
        .pipe(less())
        .on('error', function(err) {
            "use strict";
            console.warn(err.message);
        })
        .pipe(verbose ? filesize() : util.noop())
        .pipe(production ? minifycss() : util.noop())
        .pipe(verbose && production ? filesize() : util.noop())
        .pipe(gulp.dest(distDir + cssDir))
        .pipe(connect.reload());
});

gulp.task('js', ['clean'], function () {

    gulp.src([srcDir + jsDir + '/**/*.js', '!' + srcDir + jsDir + '/vendor/**'])
        .pipe(concat('main.js'))
        .pipe(verbose ? filesize() : util.noop())
        .pipe(production ? uglify() : util.noop())
        .pipe(verbose && production ? filesize() : util.noop())
        .pipe(gulp.dest(distDir + jsDir))
        .pipe(connect.reload());

    gulp.src(srcDir + jsDir + '/vendor/**')
        .pipe(gulp.dest(distDir + jsDir + '/vendor'))
        .pipe(connect.reload());
});

gulp.task('files', ['clean'], function () {
    return gulp.src(
        [
                srcDir + '/**',
                '!' + srcDir + jsDir + '/**/*',
                '!' + srcDir + cssDir + '/**/*'
        ]
    )
        .pipe(gulp.dest(distDir))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(srcDir + jsDir + '/**/*.js', ['js']);
    gulp.watch(srcDir + cssDir + '/**/*.less', ['css']);
    gulp.watch([srcDir + '/**', '!' + srcDir + jsDir + '/**/*.js', '!' + srcDir + cssDir + '/**/*.less'], ['files']);

    connect.server({
        root: distDir,
        livereload: true
    });

    gulp.src(distDir + '/index.html')
        .pipe(open('', {url:'http://localhost:8080'}));

});
gulp.task('uploadToS3', function(){
    var aws = JSON.parse(fs.readFileSync('./aws.json'));
    gulp.src(distDir + '/**')
        .pipe(gzip())
        .pipe(s3(aws, { gzippedOnly: true }))
        .on('error', function(err) {
            "use strict";
            console.warn(err.message);
        })

});

gulp.task('toS3', ['default', 'uploadToS3']);
gulp.task('server', ['compile', 'watch']);
gulp.task('compile', ['css', 'js', 'files']);
gulp.task('default', ['production', 'compile']);


module.exports = gulp;