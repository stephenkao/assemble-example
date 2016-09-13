// Gulp + Plugins
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const extname = require('gulp-extname');
const del = require('del');
// Assemble
const assemble = require('assemble');
const engine = require('engine-assemble');
const layouts = require('handlebars-layouts');


const templateFiles = './templates/**/*';
const layoutFiles = './templates/layouts/**/*';
const pageFiles = './templates/pages/**/*';
const partialFiles = './templates/partials/**/*';
const dataFiles = './data/**/*';
const distFiles = './dist/**/*';

// Initialize the Assemble app
const app = assemble();
app.engine('hbs', engine);
app.helpers(layouts(engine.Handlebars));

gulp.task('clean', () => del([distFiles]));

gulp.task('load', (cb) => {
  app.data(dataFiles);
  app.layouts(layoutFiles);
  app.pages(pageFiles);
  app.partials(partialFiles);
  cb();
});

gulp.task('render', () => {
  return app.toStream('pages')
            .pipe(app.renderFile()).on('error', console.log)
            .pipe(htmlmin())
            .pipe(extname())
            .pipe(app.dest('dist')).on('error', console.log);
});

gulp.task('assemble', gulp.series('load', 'render'));

gulp.task('assemble:watch', () => {
  gulp.watch([
    dataFiles,
    templateFiles
  ]).on('change', gulp.series('assemble'));
});

gulp.task('watch', gulp.series('assemble', 'assemble:watch'));

gulp.task('default', gulp.series('assemble'));
