var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  livereload = require("gulp-livereload"),
  clean = require("gulp-clean"),
  babel = require("gulp-babel");

gulp.task("default", ["clean"], function() {
  gulp.run("clean");
  gulp.run("generate");
  gulp.run("watch");
});

gulp.task("reload", ["clean", "default"]);

gulp.task("js", function() {
  return gulp
    .src("static/src/js/**/*.*")
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(gulp.dest("static/public/js"))
    .pipe(livereload())
    .pipe(notify({ message: "Scripts task complete" }));
});

gulp.task("css", function() {
  return gulp
    .src("static/src/css/**/*.css")
    .pipe(gulp.dest("static/public/css"))
    .pipe(livereload())
    .pipe(notify({ message: "CSS task complete" }));
});

gulp.task("clean", function() {
  return gulp
    .src(["static/public/css/*.css", "static/public/js/*.js"], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task("watch", function() {
  livereload.listen();
  gulp.watch(["src/**"]).on("change", livereload.changed);

  gulp.watch("src/js/*.js", ["js"]);
  gulp.watch("src/js/**/*.js", ["js"]);
});

gulp.task("generate", ["js", "css"]);
