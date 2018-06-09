const gulp = require('gulp');
const gutil = require('gulp-util');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-live-server': 'serve'
  }
});

gulp.task('default', ['watch']);
gulp.task('server', ['serve', 'watch']);

gulp.task('build-html', () => {
 return gulp.src('*.html')
   .pipe(gulp.dest('dist'));
})

gulp.task('build-js', function () {
  return gulp.src('assets/js/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.uglify({
      output: {
        'ascii_only': true
      }
    }))
    .pipe(plugins.concat('main.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', function () {
  return gulp.src('assets/less/style.less')
    .pipe(plugins.plumber())
    .pipe(plugins.less())
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(plugins.cssmin())
    .pipe(gulp.dest('dist/css')).on('error', gutil.log);
});

gulp.task('watch', function () {
  gulp.watch('assets/js/**/*.js', ['build-js']);
  gulp.watch('assets/less/**/*.less', ['build-css']);
  gulp.watch('*.html', ['build-html']);
});

gulp.task('serve', function () {
  var server = plugins.serve.static('/dist', 3000);
  server.start();
  gulp.watch(['build/*'], function (file) {
    server.notify.apply(server, [file]);
  });
});
