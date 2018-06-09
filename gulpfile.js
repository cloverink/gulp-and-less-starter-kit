const gulp = require('gulp')
const gutil = require('gulp-util')
const cleanhtml = require('gulp-cleanhtml')
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-live-server': 'serve'
  }
})
const config = require('./config.json')

gulp.task('build-js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plugins.uglify({
      output: {
        'ascii_only': true
      }
    }))
    .pipe(plugins.concat('main.min.js'))
    .pipe(gulp.dest('dist/js'))
})


gulp.task('build-css', () => {
  return gulp.src('src/less/style.less')
    .pipe(plugins.plumber())
    .pipe(plugins.less())
    .on('error', function(err) {
      gutil.log(err)
      this.emit('end')
    })
    .pipe(plugins.cssmin())
    .pipe(gulp.dest('dist/css')).on('error', gutil.log)
})

gulp.task('build-html', () => gulp.src('src/*.html').pipe(cleanhtml()).pipe(gulp.dest('dist')))

gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['build-js'])
  gulp.watch('src/less/**/*.less', ['build-css'])
  gulp.watch('src/*.html', ['build-html'])
})

gulp.task('serve', () => {
  var server = plugins.serve.static('/dist', 3000)
  server.start()
  gulp.watch(['dist/*'], function(file) {
    server.notify.apply(server, [file])
  })
})

gulp.task('image-copy', () => gulp.src('src/img/*.{jpg,png,gif,svg}').pipe(gulp.dest('dist/img')))
gulp.task('build-js-vendors', () => gulp.src(config.vendors.scripts).pipe(gulp.dest('dist/js')))
gulp.task('build-css-vendors', () => gulp.src(config.vendors.styles).pipe(gulp.dest('dist/css')))

gulp.task('default', ['watch', 'build-html', 'build-js', 'build-css', 'build-js-vendors', 'build-css-vendors', 'image-copy'])
gulp.task('server', ['serve', 'default'])

