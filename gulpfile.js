"use strict";

var gulp        = require('gulp')               ,
    concat      = require('gulp-concat')        ,
    notify      = require('gulp-notify')        ,
    connect     = require('gulp-connect')       ,
    uglify      = require('gulp-uglify')        ;

gulp.task('connect',function(){
    connect.server({
        root        : 'public',
        livereload  : true
    })
});

gulp.task('core',function(){
    gulp.src(['js/*.js','js/*/*.js'])
        .pipe(concat('excessor.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('excessor/'))
        .pipe(connect.reload())
        .pipe(notify('core reload'));
});

gulp.task('drawings',function(){
    gulp.src('drawing/*.js')
        .pipe(concat('drawing.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('excessor/examples/'))
        .pipe(connect.reload())
        .pipe(notify('drawing reload'));
});

gulp.task('html',function(){
    gulp.src('index.html')
        .pipe(connect.reload());
});

gulp.task('watch',function(){
    gulp.watch(['js/*.js','js/*/*.js'],['core']);
    gulp.watch('drawing/*.js',['drawings']);
    gulp.watch('public/index.html',['html']);
});

gulp.task('default',['core','drawings','html','connect','watch']);