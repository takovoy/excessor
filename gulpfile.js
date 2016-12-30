"use strict";

var gulp        = require('gulp')               ,
    concat      = require('gulp-concat')        ,
    notify      = require('gulp-notify')        ,
    minify      = require('gulp-minify')        ;

gulp.task('core',function(){
    gulp.src(['src/excessor/*.js','src/excessor/*/*.js'])
        .pipe(concat('excessor.js'))
        .pipe(minify())
        .pipe(gulp.dest('excessor/'))
        .pipe(notify('core reload'));
});

gulp.task('scenario',function(){
    gulp.src(['src/scenario/*.js','src/scenario/**/*.js'])
        .pipe(concat('scenario.js'))
        .pipe(minify())
        .pipe(gulp.dest('excessor/'))
        .pipe(notify('scenario reload'));
});

gulp.task('scenarioStyles',function(){
    gulp.src(['src/scenario/*.css','src/scenario/*/*.css'])
        .pipe(concat('scenario.css'))
        .pipe(minify())
        .pipe(gulp.dest('excessor/'))
        .pipe(notify('scenario styles reload'));
});

gulp.task('drawings',function(){
    gulp.src('drawing/*.js')
        .pipe(concat('drawing.js'))
        .pipe(minify())
        .pipe(gulp.dest('excessor/examples/'))
        .pipe(notify('drawing reload'));
});

gulp.task('watch',function(){
    gulp.watch(['src/excessor/*.js','src/excessor/*/*.js'],['core']);
    gulp.watch(['src/scenario/*.js','src/scenario/**/*.js'],['scenario']);
    gulp.watch(['src/scenario/*.css','src/scenario/*/*.css'],['scenarioStyles']);
    gulp.watch('drawing/*.js',['drawings']);
});

gulp.task('default',['core','scenario','scenarioStyles','drawings','watch']);