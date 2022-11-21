const gulp = require("gulp");
const { dest } = require("gulp");
const replace = require("gulp-replace");
const bump = require("gulp-bump");
const fs = require("fs");
const prompt = require("gulp-prompt");

let _projectName = ""

gulp.task("bump", (done) => {
	const p = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
	fs.writeFile("./version.json", JSON.stringify({ version: p.version }), "utf8", (err) => {
		if (err) {
			done(err)
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
			done(err)
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

	gulp.src([
		"./functions.php",
		"./style.css",
		"./css/style.css",
		"./sass/style.scss"
	], { base: "./" })
		.pipe(replace(prev.version, next.version))
		.pipe(dest("./"));
	done();
});

// This requires to be 6 seperated steps, otherwise some of the output are broken.
gulp.task("renameProject1", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")

	return gulp.src([
		"./inc/template-tags.php",
		"./template-parts/content-none.php",
		"./template-parts/content-page.php",
		"./template-parts/content.php",
		"./404.php",
		"./comments.php",
		"./footer.php",
		"./functions.php",
		"./header.php",
		"./README.md",
		"./search.php",
		"./single.php"
	], { base: "./" })
		.pipe(replace("'_s'", `'${projectName}'`))
		.pipe(dest("./"));
});
gulp.task("renameProject2", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")


	return gulp.src([
		"./inc/customizer.php",
		"./inc/custom-header.php",
		"./inc/jetpack.php",
		"./inc/template-functions.php",
		"./inc/template-tags.php",
		"./inc/wpcom.php",
		"./template-parts/content-page.php",
		"./template-parts/content-search.php",
		"./template-parts/content.php",
		"./404.php",
		"./comments.php",
		"./functions.php",
		"./header.php",
		"./README.md",
	], { base: "./" })
		.pipe(replace("_s_", `${projectName}_`))
		.pipe(dest("./"));

});
gulp.task("renameProject3", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")



	return gulp.src([
		"./css/style.css",
		"./sass/style.scss",
		"./README.md",
		"./style.css",
	], { base: "./" })
		.pipe(replace("Text Domain: _s", `Text Domain: ${projectName}`))
		.pipe(dest("./"));

});
gulp.task("renameProject4", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")

	return gulp.src([
		"./css/style.css",
		"./inc/custom-header.php",
		"./inc/customizer.php",
		"./inc/jetpack.php",
		"./inc/template-functions.php",
		"./inc/template-tags.php",
		"./inc/wpcom.php",
		"./languages/_s.pot",
		"./sass/style.scss",
		"./template-parts/content-none.php",
		"./template-parts/content-page.php",
		"./template-parts/content-search.php",
		"./template-parts/content.php",
		"./404.php",
		"./archive.php",
		"./comments.php",
		"./composer.json",
		"./footer.php",
		"./functions.php",
		"./header.php",
		"./index.php",
		"./page.php",
		"./phpcs.xml.dist",
		"./README.md",
		"./readme.txt",
		"./search.php",
		"./sidebar.php",
		"./single.php",
		"./style.css"
	], { base: "./" })
		.pipe(replace(" _s", ` ${projectName}`))
		.pipe(dest("./"));
});
gulp.task("renameProject5", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")

	return gulp.src([
		"./inc/customizer.php",
		"./inc/jetpack.php",
		"./functions.php",
		"./README.md",
	], { base: "./" })
		.pipe(replace("_s-", `${projectName}-`))
		.pipe(dest("./"));
});
gulp.task("renameProject6", (done) => {
	if (!_projectName || !_projectName.trim()) {
		done("Project name is required")
	}

	const projectName = _projectName.trim().replaceAll(" ", "_")

	return gulp.src([
		"./inc/customizer.php",
		"./functions.php",
		"./README.md",
	], { base: "./" })
		.pipe(replace("_S_", `${projectName.toUpperCase()}_`))
		.pipe(dest("./"));

});

gulp.task("init", async (done) => {
	const projectName = await new Promise((res) => {
		gulp.src("./")
			.pipe(prompt.prompt({
				type: "input",
				name: "project_name",
				message: "What is the project name?"
			}, (result) => {
				res(result.project_name)
			}))
	})

	_projectName = projectName
	done();
});

gulp.task("bump", gulp.series("bump"));
gulp.task("replaceVersion", gulp.series("replaceVersion"));
// gulp.task("new", gulp.series("new"));
gulp.task("init", gulp.series("init", "renameProject1", "renameProject2", "renameProject3", "renameProject4", "renameProject5", "renameProject6"));

// gulp.src(['test.txt'])
//     .pipe(replace('aaa', 'bbb'))
//     .pipe(gulp.dest('.'))
