const gulp = require("gulp");
const { dest } = require("gulp");
const replace = require("gulp-replace");
const bump = require("gulp-bump");
const fs = require("fs");

gulp.task("bump", (done) => {
	const p = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
	fs.writeFile("./version.json", JSON.stringify({ version: p.version }), "utf8", (err) => {
		if (err) {
			throw err;
		}
		console.log("complete");
	});
	gulp.src(["./package.json"])
		.pipe(bump({ type: "minor" }))
		.pipe(gulp.dest("./"));

	done();
});

gulp.task("bumpMajor", (done) => {
	const p = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
	fs.writeFile("./version.json", JSON.stringify({ version: p.version }), "utf8", (err) => {
		if (err) {
			throw err;
		}
		console.log("complete");
	});
	gulp.src(["./package.json"])
		.pipe(bump({ type: "major" }))
		.pipe(gulp.dest("./"));

	done();
});

gulp.task("replaceVersion", (done) => {
	const next = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
	const prev = JSON.parse(fs.readFileSync("./version.json", "utf-8"));

	gulp.src(["./functions.php", "./style.css"])
		.pipe(replace(prev.version, next.version))
		.pipe(dest("./"));
	gulp.src(["./css/style.css"])
		.pipe(replace(prev.version, next.version))
		.pipe(dest("./css/"));
	gulp.src(["./sass/style.scss"])
		.pipe(replace(prev.version, next.version))
		.pipe(dest("./scss/"));
	done();
});
gulp.task("bump", gulp.series("bump"));
gulp.task("replaceVersion", gulp.series("replaceVersion"));
