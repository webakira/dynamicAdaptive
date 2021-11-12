// ? ============================================
// ? Настройка основных путей
let project_folder = "public";
let short_folder = "dist";
let source_folder = "#src";

let fs = require('fs');

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		onlycss: project_folder + "/css/plugins/",
		js: project_folder + "/js/",
		js_plugins: project_folder + "/js/plugins/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		onlycss: source_folder + "/scss/plugins/**/*.*",
		js: source_folder + "/js/scripts.js",
		js_plugins: [source_folder + "/js/plugins/**/*.js", "!" + source_folder + "/js/plugins/**/_*.js"],
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/**/*.ttf",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		onlycss: source_folder + "/scss/plugins/**/*.css",
		js: source_folder + "/js/**/*.js",
		js_plugins: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	short: {
		html: short_folder + "/",
		css: short_folder + "/scss/",
		onlycss: short_folder + "/scss/plugins/",
		js: short_folder + "/js/",
		js_plugins: short_folder + "/js/plugins/",
	},
	shortSrc: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: [source_folder + "/scss/_element.scss", source_folder + "/scss/_element-theme.scss"],
		onlycss: source_folder + "/scss/plugins/**/*.*",
		js: source_folder + "/js/function.js",
		js_plugins: source_folder + "/js/plugins/**/*.*",
	},

	clean: "./" + project_folder + "/",
	cleanShort: "./" + short_folder + "/",
}

// ? ============================================
// ? Подключение плагинов
let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	imagemin = require('gulp-imagemin');


// ? ============================================
// ? Ядро сборки

// todo функция для перезагрузки браузера при изменении файлов в папке "project_folder"
function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false
	})
}

// todo HTML Работаем с файлафи .html затем выгружаем все в папку "project_folder"
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function htmlShort() {
	return src(path.shortSrc.html)
		.pipe(fileinclude())
		.pipe(dest(path.short.html))
		.pipe(browsersync.stream())
}

// todo CSS Работаем с файлафи .scss затем выгружаем все в папку "project_folder/css"
function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function csscopy() {
	return src(path.src.onlycss)
		.pipe(dest(path.build.onlycss))
		.pipe(browsersync.stream())
}

function csscopyshort() {
	return src(path.shortSrc.onlycss)
		.pipe(dest(path.short.onlycss))
		.pipe(browsersync.stream())
}

function csscopyshort2() {
	return src(path.shortSrc.css)
		.pipe(dest(path.short.css))
		.pipe(browsersync.stream())
}


// todo JS Работаем с файлафи .JS затем выгружаем все в папку "project_folder/js"
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function js_plugins() {
	return src(path.src.js_plugins)
		.pipe(dest(path.build.js_plugins))
		.pipe(browsersync.stream())
}

function js_plugins_short() {
	return src(path.shortSrc.js_plugins)
		.pipe(dest(path.short.js_plugins))
		.pipe(browsersync.stream())
}

function js_short() {
	return src(path.shortSrc.js)
		.pipe(dest(path.short.js))
		.pipe(browsersync.stream())
}

// todo FONTS Работаем со шрифтами "project_folder/fonts"
function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
};

// Эту функцию нужно запускать в ручную для преобразованя .otf в .ttf
gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(
			fonter({
				formats: ['ttf']
			})
		)
		.pipe(dest(source_folder + '/fonts/'))
})

// Эта функция записывает шрифты в файлы _fonts.scss, если файл пустой
function fontsStyle() {
	let file_content = fs.readFileSync(source_folder + '/scss/basis/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/basis/_fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname; for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/basis/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					} c_fontname = fontname;
				}
			}
		})
	}
}

// todo IMAGE Работаем с изображениями
function images() {
	return src(path.src.img)
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}


// todo WATCH Функция, которая будет следить за изменениями фалов в папке "#src" и перезаписывть их, если будут изменения
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.onlycss], csscopy);

	gulp.watch([path.watch.html], htmlShort);
	gulp.watch([path.watch.css], csscopyshort);
	gulp.watch([path.watch.css], csscopyshort2);
	gulp.watch([path.watch.js], js_plugins_short);
	gulp.watch([path.watch.js], js_short);
}

// todo DELET ALL Функция удаляет всю папку public
function clean() {
	return del(path.clean)
}
function cleanShort() {
	return del(path.cleanShort)
}

// ? ============================================
// ? Запуск сборки
function cb() {

}

let buildShort = gulp.series(cleanShort, gulp.parallel(htmlShort, csscopyshort, csscopyshort2, js_plugins_short, js_short, images));

let build = gulp.series(clean, gulp.parallel(js_plugins, js, css, csscopy, html, fonts, images), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync, buildShort);



exports.buildShort = buildShort;
exports.htmlShort = htmlShort;
exports.csscopyshort = csscopyshort;
exports.csscopyshort2 = csscopyshort2;
exports.js_plugins_short = js_plugins_short;
exports.js_short = js_short;

exports.csscopy = csscopy;
exports.images = images;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.js_plugins = js_plugins;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;