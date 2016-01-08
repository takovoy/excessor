"use strict";

var gulp        = require('gulp')               ,
    concat      = require('gulp-concat')        ,
    notify      = require('gulp-notify')        ,
    uglify      = require('gulp-uglify')        ;

gulp.task('core',function(){
    gulp.src(['js/*.js','js/*/*.js'])
        .pipe(concat('excessor.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('excessor/'))
        .pipe(notify('core reload'));
});

gulp.task('drawings',function(){
    gulp.src('drawing/*.js')
        .pipe(concat('drawing.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('excessor/examples/'))
        .pipe(notify('drawing reload'));
});

gulp.task('watch',function(){
    gulp.watch(['js/*.js','js/*/*.js'],['core']);
    gulp.watch('drawing/*.js',['drawings']);
});

gulp.task('default',['core','drawings','watch']);