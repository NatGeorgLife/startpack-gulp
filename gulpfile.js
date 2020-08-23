//===============================ПУТИ===============================//
const build_folder = 'dist'
const source_folder = 'src'
const path = {
    build: {
        html: `${build_folder}/`,
        css: `${build_folder}/css/`,
        js: `${build_folder}/js/`,
        img: `${build_folder}/img/`,
        svg: `${build_folder}/svg/`,
        font: `${build_folder}/fonts/`
    },
    src: {
        html: `${source_folder}/*.html`,
        css: `${source_folder}/scss/style.scss`,
        js: `${source_folder}/js/script.js`,
        img: `${source_folder}/img/**/*.{jpg,png,ico}`,
        svg: `${source_folder}/svg/**/*.svg`,
        font: `${source_folder}/fonts/**/*.ttf`
    },
    watch: {
        html: `${source_folder}/**/*.html`,
        css: `${source_folder}/scss/**/*.scss`,
        js: `${source_folder}/js/**/*.js`,
        svg: `${source_folder}/svg/**/*.svg`,
        img: `${source_folder}/img/**/*.{jpg,png,ico}`
    },
    clean: `./${build_folder}/`
}
//===============================МОДУЛИ===============================//
const {src, dest, watch, series, parallel} = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupmedia = require('gulp-group-css-media-queries'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglifyjs = require('gulp-uglify-es').default,
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    svgsprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff')
//===============================ЗАДАЧИ===============================//
function server() {
    browsersync.init({
        server: {baseDir: `./${build_folder}/`},
        port: 3000,
        notify: false
    })
}
//====================================================================//
function watcher() {
    watch([path.watch.html], html)
    watch([path.watch.css], css)
    watch([path.watch.js], js)
    watch([path.watch.img], img)
    watch([path.watch.svg], svg)
}
//====================================================================//
function clean() {
    return del(path.clean)
}
//====================================================================//
function html() {
    return (
        src(path.src.html)
            .pipe(fileinclude())
            .pipe(dest(path.build.html))
            .pipe(browsersync.stream())
    )
}
//====================================================================//
function css() {
    return (
        src(path.src.css)
            .pipe(scss({outputStyle: 'expanded'}))
            .pipe(groupmedia())
            .pipe(dest(path.build.css))
            .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions']}))
            .pipe(cleancss())
            .pipe(rename({extname: '.min.css'}))
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream())
    )
}
//====================================================================//
function js() {
    return (
        src(path.src.js)
            .pipe(fileinclude())
            .pipe(dest(path.build.js))
            .pipe(rename({extname: '.min.js'}))
            .pipe(babel({presets: ['@babel/env']}))
            .pipe(uglifyjs())
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
    )
}
//====================================================================//
function img() {
    return (
        src(path.src.img)
            .pipe(imagemin())
            .pipe(dest(path.build.img))
            .pipe(browsersync.stream())
    )
}
//====================================================================//
function svg() {
    return (
       src(path.src.svg)
            .pipe(svgsprite({mode: {stack: {sprite: `../sprite.svg`}}}))
            .pipe(dest(path.build.svg))
            .pipe(browsersync.stream())
    )
}
//====================================================================//
function fonts() {
    return (
        src(path.src.font)
            .pipe(ttf2woff())
            .pipe(dest(path.build.font))
            .pipe(browsersync.stream())
    )
}
//===============================ЭКСПОРТ===============================//
const build = series(clean, fonts, img, svg, css, js, html)
const launch = parallel(server, watcher)
module.exports.watch = series(build, launch)