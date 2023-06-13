
// // import App from './src/app';  
var gulp        = require('gulp');
var merge       = require('merge-stream');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var babelify    = require("babelify");
// var watch       = require('gulp-watch');

var sass        = require('gulp-sass')(require('sass'));
var htmlmin     = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var minifycss   = require('gulp-minify-css'); 
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var imagemin    = require('gulp-imagemin');
var rename      = require('gulp-rename');
var clean       = require('gulp-clean');
var replace     = require('gulp-replace');
var concat      = require('gulp-concat');
var notify      = require('gulp-notify');
var cache       = require('gulp-cache');
var livereload  = require('gulp-livereload');
var lr          = require('tiny-lr');
var server      = lr();


// Clean
// gulp.task('clean', function() {
//   return gulp.src(['dist/src/css', 'dist/src/js', 'dist/src/img'], {read: false, allowEmpty: true})
//     .pipe(clean())
//     .pipe(notify({ message: 'clean complete' }));
// });

function doClean(){
  return gulp.src(['dist/src/css', 'dist/src/js', 'dist/src/img', 'dist/src/json'], {read: false, allowEmpty: true})
  .pipe(clean());
  // .pipe(notify({ message: 'Start' }));
};

function generateImg(){
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(livereload(server))
  .pipe(gulp.dest('dist/src/img')); 
};

function generateCSS(){  
    var style = gulp.src('src/css/style.css')
        // .pipe(sass({ style: 'expanded', }))
        // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/src/css'));
      
    var bootstrap = gulp.src('src/css/bootstrap.min.css') 
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/src/css'));

    return merge(style, bootstrap);
} 

function generateJS(){
  var allJs = gulp.src('src/js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    // .pipe(gulp.dest('dist/src/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/src/js'));

    var mainJs = gulp.src('src/*.js') 
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/src/'));
    // .pipe(notify({ message: 'Task complete' })); 
    
    return merge(mainJs, allJs);
};

function generateHTML() {
  return gulp.src(['*.html'])
    .pipe(replace('style.css', 'style.min.css'))
    .pipe(replace('main.js', 'main.min.js'))
    .pipe(replace('app.js', 'app.min.js'))
    .pipe(replace('mainController.js', 'mainController.min.js'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
}

function copyFile() {
  return gulp.src('src/js/**/*.json')
    .pipe(gulp.dest('dist/src/'));
}

function copyLibFile() {
  return gulp.src('lib/**/*min*')
    .pipe(gulp.dest('dist/lib/'));
}

exports.default = gulp.series(doClean, gulp.parallel(generateCSS, generateImg, generateHTML, copyFile, copyLibFile), generateJS); 

// gulp.task('make:fun', function(){
//   return browserify({
//     entries: [
//       'app.js'
//     ]
//   })
//   .transform('babelify')
//   .bundle()
//   .pipe(source('src/app.js'))
//   .pipe(gulp.dest('dist/'));
// }); 