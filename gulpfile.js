var
  gulp = require('gulp'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  tsify = require('tsify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  notify = require('gulp-notify'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),

  stylus = require('gulp-stylus'),
  poststylus = require('poststylus'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano')

var paths = {
  dist: './dist/',
  src: {
    scripts: ['./src/scripts/main.tsx'],
    scriptsWatch: ['./src/scripts/**/*.ts', './src/scripts/**/*.tsx', '!./src/scripts/__tests__/**/*'],
    tests: ['./src/scripts/**/*.test.ts'],
    styles: './src/styles/bundle.styl',
    stylesWatch: './src/styles/**/*.styl',
    html: './src/index.html'
  }
}

function createTsBundler(isWatch) {
  var props = {
    entries: paths.src.scripts,
    debug: isWatch,
    cache: {},
    packageCache: {}
  }

  var bundler = browserify(props)
    .plugin(tsify, { jsx: 'react', 'experimentalDecorators': true, target: 'es5' })

  if (isWatch)
    bundler = watchify(bundler)

  return bundler
}

function bundleTs(bundler) {
  var sw = Date.now()
  var hasError = false

  gutil.log('Building', gutil.colors.cyan('TypeScript'), '...')

  bundler.bundle()
    .on('error', notify.onError(function (error) {
      hasError = true
      return {
        title: error.name,
        message: error.message
      };
    }))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .on('end', function () {
      if (!hasError)
        gutil.log('Build', gutil.colors.cyan('TypeScript'), 'succeeded in', gutil.colors.magenta(Date.now() - sw + 'ms'))
    })
}

gulp.task('scripts', function () {
  bundleTs(createTsBundler(false))
})

gulp.task('html', function () {
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dist))
})

gulp.task('styles', function () {
  var processors = [
    autoprefixer({ browsers: ['> 1%'] }),
    //cssnano
  ];
  return gulp.src(paths.src.styles)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(stylus({ use: [poststylus(processors)] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
})

gulp.task('watch', function () {
  var tsBundler = createTsBundler(true)
  watch(paths.src.scriptsWatch, function () {
    bundleTs(tsBundler)
  })
  watch(paths.src.html, function () { gulp.start(['html']) })
  watch(paths.src.stylesWatch, function () { gulp.start(['styles']) })
  watch(paths.src.tests, function () { gulp.start(['build-tests']) })
})

gulp.task('default', ['scripts', 'styles', 'html'])