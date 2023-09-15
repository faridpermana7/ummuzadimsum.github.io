
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

function cleanDistribution(){
  return gulp.src([
    'dist/lib', 
    'dist/config', 
    'dist/node_modules', 
    'dist/src', 
    'dist/index.html'
  ], {read: false, allowEmpty: true})
  .pipe(clean()); 
};

function generateImg(){
  return gulp.src('src/img/**/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(livereload(server))
  .pipe(gulp.dest('dist/src/img')); 
};


function generateImgLeaflet(){
  return gulp.src('node_modules/leaflet/dist/images/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(livereload(server))
  .pipe(gulp.dest('dist/lib/leaflet/images/')); 
};

function generateCSS(){  
    var style = gulp.src('src/css/*.css')
      // .pipe(sass({ style: 'expanded', }))
      // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      // .pipe(gulp.dest('dist/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/src/css')); 
      
    var leaflet = gulp.src('node_modules/leaflet/dist/leaflet.css') 
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/lib/leaflet/')); 
      
    var leafletMarker = gulp.src('node_modules/leaflet.markercluster/dist/MarkerCluster.css') 
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/lib/leaflet/')); 
      
    var leafletMarkerDef = gulp.src('node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css') 
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/lib/leaflet/')); 

    var copyCss = gulp.src([
      'src/css/bootstrap.min.css',
      'node_modules/datatables/media/css/jquery.dataTables.min.css',
      'node_modules/sweetalert2/dist/sweetalert2.min.css',
      'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
      'node_modules/ui-select/dist/select.css',
      'node_modules/datatables/media/css/jquery.dataTables.min.css',
      'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
      'node_modules/ui-select/dist/select.css'
      ]) 
      .pipe(livereload(server))
      .pipe(gulp.dest('dist/lib/'));   
      
    return merge(
      style,  
      copyCss,  
      leaflet,
      leafletMarker,
      leafletMarkerDef
    );
} 

function generateMainJs(){
    var libJs = gulp.src('lib/*.js') 
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/lib/'));

    var confJs = gulp.src('config/*.js') 
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/config/'));
    
    var directive = gulp.src('src/directive/*.js') 
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/src/directive/')); 

    var modules = gulp.src('src/**/**/*.js') 
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/src/'));  
    
    return merge( 
      libJs, 
      confJs, 
      directive,
      modules
    );
};

function generateIndexHTML() {
  return gulp.src(['index.html'])
  //CSS
    .pipe(replace('style.css', 'style.min.css'))  
    .pipe(replace('loader.css', 'loader.min.css'))  
    .pipe(replace('select2.css', 'select2.min.css'))   
    .pipe(replace('src/css/bootstrap.min.css', 'lib/bootstrap.min.css'))   

    .pipe(replace('bootstrap-datetimepicker.css', 'bootstrap-datetimepicker.min.css'))  
    .pipe(replace('node_modules/datatables/media/css/jquery.dataTables.min.css', 'lib/jquery.dataTables.min.css'))
    .pipe(replace('node_modules/angular-datatables/dist/css/angular-datatables.min.css', 'lib/angular-datatables.min.css'))
    .pipe(replace('node_modules/ui-select/dist/select.css', 'lib/select.css'))
    .pipe(replace('node_modules/sweetalert2/dist/sweetalert2.min.css', 'lib/sweetalert2.min.css')) 
    .pipe(replace('node_modules/leaflet/dist/leaflet.css', 'lib/leaflet/leaflet.min.css')) 
    .pipe(replace('node_modules/leaflet.markercluster/dist/MarkerCluster.css', 'lib/leaflet/MarkerCluster.min.css')) 
    .pipe(replace('node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css', 'lib/leaflet/MarkerCluster.Default.min.css')) 
  //ANGULAR JS
    .pipe(replace('node_modules/angular/angular.js', 'lib/angular.js'))
    .pipe(replace('node_modules/angular-ui-router/release/angular-ui-router.min.js', 'lib/angular-ui-router.min.js'))
    .pipe(replace('node_modules/angular-cookies/angular-cookies.min.js', 'lib/angular-cookies.min.js'))
    .pipe(replace('node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js', 'lib/angular-breadcrumb.min.js'))
    .pipe(replace('node_modules/angular-animate/angular-animate.js', 'lib/angular-animate.js'))
    .pipe(replace('node_modules/angular-touch/angular-touch.js', 'lib/angular-touch.js'))
    .pipe(replace('node_modules/angular-sanitize/angular-sanitize.js', 'lib/angular-sanitize.js'))
    .pipe(replace('node_modules/angular-datatables/dist/angular-datatables.min.js', 'lib/angular-datatables.min.js'))
	  .pipe(replace('node_modules/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js', 'lib/angular-datatables.scroller.min.js'))
    .pipe(replace('node_modules/angular-datatables/dist/plugins/select/angular-datatables.select.min.js', 'lib/angular-datatables.select.min.js'))
    .pipe(replace('node_modules/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js', 'lib/angular-datatables.fixedcolumns.js'))
    //MAIN JS
    .pipe(replace('main.js', 'main.min.js'))
    .pipe(replace('app.js', 'app.min.js'))
    .pipe(replace('farst-lib.js', 'farst-lib.min.js'))
    .pipe(replace('app.config.js', 'app.config.min.js'))
    .pipe(replace('farstFactory.js', 'farstFactory.min.js'))
    .pipe(replace('httpService.js', 'httpService.min.js'))
    // .pipe(replace('navbarService.js', 'navBarService.min.js'))
    .pipe(replace('src/layout/nav-bar/navbarService.js', 'lib/navbarService.js'))
    .pipe(replace('datatableService.js', 'datatableService.min.js'))
    .pipe(replace('validationService.js', 'validationService.min.js'))
    
    //node modules
    .pipe(replace('node_modules/sweetalert2/dist/sweetalert2.all.min.js', 'lib/sweetalert2.all.min.js'))
    .pipe(replace('node_modules/underscore/underscore-min.js', 'lib/underscore-min.js')) 
    .pipe(replace('node_modules/moment/moment.js', 'lib/moment.js')) 
    .pipe(replace('node_modules/moment-timezone/moment-timezone.js', 'lib/moment-timezone.js')) 
    .pipe(replace('node_modules/html2canvas/dist/html2canvas.min.js', 'lib/html2canvas.min.js')) 
    .pipe(replace('node_modules/leaflet.markercluster/dist/leaflet.markercluster.js', 'lib/leaflet/leaflet.markercluster.js')) 
    .pipe(replace('node_modules/leaflet/dist/leaflet.js', 'lib/leaflet/leaflet.js'))  
    .pipe(replace('node_modules/select2/dist/js/select2.js', 'lib/select2.js'))
    .pipe(replace('node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js', 'lib/ui-bootstrap-tpls.js'))
    .pipe(replace('node_modules/jquery.dataTables.min.js', 'lib/jquery.dataTables.min.js'))
    .pipe(replace('node_modules/ui-select/dist/select.min.js', 'lib/select.min.js'))
    .pipe(replace('node_modules/jquery.dataTables.min.js', 'lib/jquery.dataTables.min.js'))
    .pipe(replace('node_modules/datatables/media/js/jquery.dataTables.min.js', 'lib/jquery.dataTables.min.js'))
    .pipe(replace('node_modules/datatables-scroller/js/dataTables.scroller.js', 'lib/dataTables.scroller.js'))
    .pipe(replace('node_modules/datatables.net-select/js/dataTables.select.js', 'lib/dataTables.select.js'))
    .pipe(replace('node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js', 'lib/dataTables.fixedColumns.js')) 
    .pipe(replace('node_modules/datatables.net-rowgroup/js/dataTables.rowGroup.js', 'lib/dataTables.rowGroup.js'))
    //ctrl&route
    .pipe(replace('bootstrapDatetimePicker.js', 'bootstrapDatetimePicker.min.js'))
    .pipe(replace('appCtrl.js', 'appCtrl.min.js'))
    .pipe(replace('appRoute.js', 'appRoute.min.js'))
    .pipe(replace('mainPageController.js', 'mainPageController.min.js'))
    .pipe(replace('mainPageRoute.js', 'mainPageRoute.min.js'))
    .pipe(replace('navBarController.js', 'navBarController.min.js'))
    .pipe(replace('footerController.js', 'footerController.min.js'))
    .pipe(replace('postController.js', 'postController.min.js'))
    .pipe(replace('postRoute.js', 'postRoute.min.js'))
    .pipe(replace('menuController.js', 'menuController.min.js'))
    .pipe(replace('menuRoute.js', 'menuRoute.min.js'))
    .pipe(replace('aboutController.js', 'aboutController.min.js'))
    .pipe(replace('aboutRoute.js', 'aboutRoute.min.js'))
    .pipe(replace('contactController.js', 'contactController.min.js'))
    .pipe(replace('contactRoute.js', 'contactRoute.min.js'))
    .pipe(replace('checkoutController.js', 'checkoutController.min.js'))
    .pipe(replace('checkoutRoute.js', 'checkoutRoute.min.js'))
    .pipe(replace('productController.js', 'productController.min.js'))
    .pipe(replace('productRoute.js', 'productRoute.min.js'))
    .pipe(replace('productEntryRoute.js', 'productEntryRoute.min.js'))
    .pipe(replace('productEntryController.js', 'productEntryController.min.js'))
    .pipe(replace('productEntryService.js', 'productEntryService.min.js'))
    .pipe(replace('newsController.js', 'newsController.min.js'))
    .pipe(replace('newsRoute.js', 'newsRoute.min.js'))
    .pipe(replace('majorityController.js', 'majorityController.min.js'))
    .pipe(replace('majorityRoute.js', 'majorityRoute.min.js'))
    .pipe(replace('majorityEntryService.js', 'majorityEntryService.min.js'))
    .pipe(replace('majorityEntryController.js', 'majorityEntryController.min.js'))
    .pipe(replace('majorityEntryRoute.js', 'majorityEntryRoute.min.js')) 
    .pipe(replace('modalLoginCtrl.js', 'modalLoginCtrl.min.js'))
    .pipe(replace('modalLoginService.js', 'modalLoginService.min.js'))
    .pipe(replace('modalLoginDirective.js', 'modalLoginDirective.min.js'))
    .pipe(replace('modalLoginRoute.js', 'modalLoginRoute.min.js'))
    .pipe(replace('sysmenuCtrl.js', 'sysmenuCtrl.min.js'))
    .pipe(replace('sysmenuRoute.js', 'sysmenuRoute.min.js'))
    .pipe(replace('sysmenuEntryCtrl.js', 'sysmenuEntryCtrl.min.js'))
    .pipe(replace('sysmenuEntryRoute.js', 'sysmenuEntryRoute.min.js'))
    .pipe(replace('sysmenuEntryDirective.js', 'sysmenuEntryDirective.min.js'))
    .pipe(replace('sysmenuEntryService.js', 'sysmenuEntryService.min.js'))
    .pipe(replace('sysmenuApiCtrl.js', 'sysmenuApiCtrl.min.js'))
    .pipe(replace('sysmenuApiDirective.js', 'sysmenuApiDirective.min.js'))
    .pipe(replace('sysmenuApiService.js', 'sysmenuApiService.min.js'))
    .pipe(replace('iconModalCtrl.js', 'iconModalCtrl.min.js'))
    .pipe(replace('iconModalDirective.js', 'iconModalDirective.min.js'))
    .pipe(replace('roleCtrl.js', 'roleCtrl.min.js'))
    .pipe(replace('roleRoute.js', 'roleRoute.min.js'))
    .pipe(replace('roleEntryCtrl.js', 'roleEntryCtrl.min.js'))
    .pipe(replace('roleEntryRoute.js', 'roleEntryRoute.min.js'))
    .pipe(replace('roleEntryService.js', 'roleEntryService.min.js'))
    .pipe(replace('userCtrl.js', 'userCtrl.min.js'))
    .pipe(replace('userRoute.js', 'userRoute.min.js'))
    .pipe(replace('userEntryCtrl.js', 'userEntryCtrl.min.js'))
    .pipe(replace('userEntryRoute.js', 'userEntryRoute.min.js'))
    .pipe(replace('userEntryService.js', 'userEntryService.min.js'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
}


function generatePageHTML() {
  return gulp.src(['src/**/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/src/'));
}

/* ONLY COPY */
function copyJsonFile() {
  return gulp.src('src/json/*.json')
    .pipe(gulp.dest('dist/src/json/'));
}

function copyNodeJsFile() {
  return gulp.src([
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js.map',
    'node_modules/angular-cookies/angular-cookies.min.js',
    'node_modules/angular-cookies/angular-cookies.min.js.map',
    'node_modules/angular-breadcrumb/dist/angular-breadcrumb.min.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-touch/angular-touch.js',
    'node_modules/angular-sanitize/angular-sanitize.js',
    "node_modules/angular-datatables/dist/angular-datatables.min.js",
	  'node_modules/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.min.js',
    'node_modules/angular-datatables/dist/plugins/select/angular-datatables.select.min.js',
    'node_modules/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js',

    'node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js',  
    'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
    'node_modules/underscore/underscore-min.js',
    'node_modules/moment/moment.js',
    'node_modules/moment-timezone/moment-timezone.js', 
    'node_modules/html2canvas/dist/html2canvas.min.js',
    'node_modules/select2/dist/js/select2.js',
    'node_modules/ui-select/dist/select.min.js',

    'node_modules/datatables/media/js/jquery.dataTables.min.js',
    'node_modules/datatables-scroller/js/dataTables.scroller.js',
    'node_modules/datatables.net-select/js/dataTables.select.js',
    'node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js', 
    'node_modules/datatables.net-rowgroup/js/dataTables.rowGroup.js',
    'src/layout/nav-bar/navbarService.js',
  ])
    .pipe(gulp.dest('dist/lib/'));
}

function copyLeafletJsFile() {
  return gulp.src([ 
    'node_modules/leaflet/dist/*.js*',
    'node_modules/leaflet.markercluster/dist/leaflet.markercluster*.js*', 
  ])
    .pipe(gulp.dest('dist/lib/leaflet/'));
}

function copyLibFile() {
  return gulp.src('lib/**/*min*')
    .pipe(gulp.dest('dist/lib/'));
}
/* ONLY COPY END */

exports.default = gulp.series(
  cleanDistribution,
  generateCSS, 
  generateImg,   
  // copyJsonFile, 
  generateImgLeaflet, 
  generateMainJs,
  generatePageHTML,
  generateIndexHTML,
  gulp.parallel(copyLibFile, copyLeafletJsFile, copyNodeJsFile, copyLeafletJsFile),
);  