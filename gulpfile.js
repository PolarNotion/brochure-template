var gulp          = require('gulp');
var sourcemaps    = require('gulp-sourcemaps');
var source        = require('vinyl-source-stream');
var buffer        = require('vinyl-buffer');
var browserify    = require('browserify');
var babel         = require('babelify');
var htmlmin       = require('gulp-htmlmin');
var bourbon       = require('bourbon');
var sass          = require('gulp-sass');
var postcss       = require('gulp-postcss');
var cssnano       = require('cssnano');
var autoprefixer  = require('autoprefixer');
var plumber       = require('gulp-plumber');
var notify        = require('gulp-notify');
var uglify        = require('gulp-uglify');
var server        = require('gulp-server-livereload');
var fontAwesome   = require('node-font-awesome');
var jshint        = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var jscs          = require('gulp-jscs');
var htmlrender    = require('gulp-htmlrender');
var watch         = require('gulp-watch'); // A Better File Watcher
var del           = require('del');
var imagemin      = require('gulp-imagemin');
var cache         = require('gulp-cache');
// Set up Foundations
var path        = require('path');
var config = {
  bootstrapDir: './node_modules/bootstrap-sass'
};

var notifyError = function() {
  return plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  });
}

var browserifyError = function(err) {
  notify.onError("Error: <%= error.message %>")(err);
  this.emit('end');
}

gulp.task('sass', function () {
  gulp.src('app/sass/main.scss')
    .pipe( notifyError() )
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({
      includePaths: [fontAwesome.scssPath, config.bootstrapDir + '/assets/stylesheets']
    }))
    .pipe(postcss([
      autoprefixer(),
      cssnano(),
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('compress', function(){
  return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  gulp.src(fontAwesome.fonts)
    .pipe( notifyError() )
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('normalize', function() {
  gulp.src(require.resolve('normalize.css'))
    .pipe( notifyError() )
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('browserify', function() {
  return browserify('./app/js/main.js', {debug: true})
    .transform(babel)
    .bundle()
    .on('error', browserifyError)
    .pipe(source('./main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('clean:dist', function(){
  return del.sync('dist/*.html');
});

gulp.task('render', function() {
  return gulp.src('app/layout/*.html', {read: false})
    .pipe(htmlrender.render())
    .pipe(htmlmin())
    .pipe(gulp.dest('dist'))
});

// Janky - quick fix to write spec file
gulp.task('browserify-test', function() {
  return browserify('./app/js/tests.js', {debug: true})
    .transform(babel)
    .bundle()
    .on('error', browserifyError)
    .pipe(source('./tests.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./spec/'));
});

gulp.task('style:js', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(notifyError())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
});

gulp.task('hint:js', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(notifyError())
    .pipe(jshint({
      esnext: true, eqeqeq: true,
      linter: require('jshint-jsx').JSXHINT
    }))
    .pipe(jshint.reporter('fail'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['style:js', 'hint:js']);

gulp.task('watch', function() {
  watch(['./app/layout/**/*.html'], function () {
    gulp.start('clean:dist');
    gulp.start('render');
  });
  watch('./app/sass/**/*.scss', function () {  
    gulp.start('sass'); 
  });
  watch(['./app/js/**/*.js', './package.json'], function () {
    gulp.start('browserify');
    gulp.start('browserify-test');
  });
  watch('./app/js/**/*.js', function () {
    gulp.start('hint:js');
    gulp.start('style:js');
  });
});

gulp.task('server', ['default'], function () {
  return gulp.src('dist')
    .pipe(server({
      livereload: true
    }));
});

gulp.task('default', ['clean:dist',
                      'render',
                      'sass',
                      'fonts',
                      'normalize',
                      'lint',
                      'browserify',
                      'browserify-test']);

gulp.task('start', ['default', 'watch', 'server']);
