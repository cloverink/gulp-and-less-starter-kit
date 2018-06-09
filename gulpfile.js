const gulp = require('gulp');
const gutil = require('gulp-util');
const cleanhtml = require('gulp-cleanhtml');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-live-server': 'serve'
  }
});

gulp.task('build-html', () => gulp.src('src/*.html').pipe(cleanhtml()).pipe(gulp.dest('dist')))

gulp.task('build-js', function () {
  return gulp.src('src/js/**/*.js')
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
  return gulp.src('src/less/style.less')
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
  gulp.watch('src/js/**/*.js', ['build-js']);
  gulp.watch('src/less/**/*.less', ['build-css']);
  gulp.watch('src/*.html', ['build-html']);
});

gulp.task('serve', function () {
  var server = plugins.serve.static('/dist', 3000);
  server.start();
  gulp.watch(['dist/*'], function (file) {
    server.notify.apply(server, [file]);
  });
});

gulp.task('default', ['watch', 'build-html', 'build-js', 'build-css']);
gulp.task('server', ['serve', 'default']);

