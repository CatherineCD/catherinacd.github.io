const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

// Load plugins
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const eslint = require('gulp-eslint');
const include = require('gulp-include');;
const sourcemaps = require('gulp-sourcemaps');
const sortMediaQueries = require('postcss-sort-media-queries');
const changed = require('gulp-changed');
const cached = require('gulp-cached');
const dependents = require('gulp-dependents');
const browsersync = require('browser-sync').create();

const projects = {
  srcSimpleFoodBlog: 'simple-food-blog/',
};

const config = {
    styles: {
      src: 'scss/**/*.scss',
      dist: 'css/',
    },
    html: {
      srcPages: 'views/pages/*.pug',
      src: 'views/**/*.pug',
      dist: '/',
    },
    scripts: {
      src: 'js/**/*.js',
      dist: 'js/',
    },
    images: {
      src: 'img/**/*',
      dist: 'img/'
    },
    fonts: {
      src: 'fonts/**/*',
      dist: 'fonts/'
    }
}

// JS function
function js() {
  return src('sites/' + projects.srcSimpleFoodBlog + config.scripts.src)
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(
      eslint({
        rules: {
          camelcase: 1,
          'comma-dangle': 2,
          quotes: 0,
        },
      })
    )
    .pipe(include())
    .pipe(uglify())
    .pipe(
      rename({
        extname: '-bundle.min.js',
      })
    )
    .pipe(dest('sites/' + projects.srcSimpleFoodBlog + config.scripts.dist))
    .pipe(browsersync.stream());
}

// HTML function
function html() {
  return src(['sites/' + projects.srcSimpleFoodBlog + config.html.srcPages, !'sites/' + projects.srcSimpleFoodBlog + config.html.src])
    .pipe(plumber())
    .pipe(pugLinter({
      reporter: 'default'
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('public/' + projects.srcSimpleFoodBlog + config.html.dist))
    .pipe(browsersync.stream());
}

// CSS function
function css() {
  return src('sites/' + projects.srcSimpleFoodBlog + config.styles.src)
    .pipe(cached('sasscache'))
    .pipe(dependents())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(postcss([autoprefixer('> 0.2%'), sortMediaQueries(), stylelint({
      fix: true
    }), reporter({
      clearMessages: true,
      throwError: true
    }), cssnano()]))
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(dest('public/' + projects.srcSimpleFoodBlog + config.styles.dist, {
      sourcemaps: true
    }))
    .pipe(browsersync.stream());
}

// Optimize images
function img() {
  return src('sites/' + projects.srcSimpleFoodBlog + config.images.src)
    .pipe(changed('public/' + projects.srcSimpleFoodBlog + config.images.dist))
    .pipe(imagemin())
    .pipe(dest('public/' + projects.srcSimpleFoodBlog + config.images.dist));
}

// Optimize images
function fonts() {
  return src('sites/' + projects.srcSimpleFoodBlog + config.fonts.src)
    .pipe(dest('public/' + projects.srcSimpleFoodBlog + config.fonts.dist));
}

// Watch files
function watchFiles() {
  watch('sites/' + projects.srcSimpleFoodBlog + config.styles.src, css);
  watch('sites/' + projects.srcSimpleFoodBlog + config.scripts.src, js);
  watch('sites/' + projects.srcSimpleFoodBlog + config.images.src, img);
  watch('sites/' + projects.srcSimpleFoodBlog + config.fonts.src, fonts);
  watch('sites/' + projects.srcSimpleFoodBlog + config.html.src, html);
}

// BrowserSync
function browserSync() {
  browsersync.init({
    server: {
      baseDir: ['./'],
      notify: false
    },
  });
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(html, parallel(css, js, fonts, img));