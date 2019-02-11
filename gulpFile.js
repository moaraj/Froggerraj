const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');

const {src, task} = require('gulp');
const eslint = require('gulp-eslint');
 
task('default', () => {
    return src(['js/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({fix:true}))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.formatEach())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

 
gulp.task('compress', function (cb) {
  pump([
        gulp.src('js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('copy-html', function(cb){
  return gulp.src('index.html')
  .pipe(gulp.dest('dist/'));
})

