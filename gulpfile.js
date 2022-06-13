import gulp from 'gulp'
import browserSync from 'browser-sync'
import notify from 'gulp-notify'
import htmlmin from 'gulp-htmlmin'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleancss from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import webpackStream from 'webpack-stream'
import svgSprite from 'gulp-svg-sprite'
import del from 'del'

const sass = gulpSass(dartSass)

function server() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		open: false,
		// tunnel: true,
	})
}

function styles() {
	return gulp.src('src/sass/**/*.sass')
		.pipe(sass({
			quietDeps: true
		}).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return gulp.src('src/js/app.js')
		.pipe(webpackStream({
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			}
		}))
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream())
}

function html() {
	return gulp.src('src/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
}

function svg() {
	return gulp.src('src/img/svg/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(gulp.dest('src/img'))
}

function copy() {
	return gulp.src(['src/fonts/**/*', 'src/img/!(svg)/**/*', 'src/img/!(svg)'], { base: 'src' })
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream({
			once: true
		}))
}

function clean() {
	return del('dist')
}

function startWatch() {
	gulp.watch(['src/fonts/**/*', 'src/img/**/*', '!src/img/!(svg)/*'], copy)
	gulp.watch(['src/img/svg/*'], svg)
	gulp.watch('src/sass/**/*.s[ac]ss', styles)
	gulp.watch(['src/js/*', '!src/js/**/*.min.js'], scripts)
	gulp.watch('src/*.html', html)
}

export { svg }

export let build = gulp.series(clean, scripts, styles, copy, html)

export default gulp.series(clean, gulp.parallel(html, styles, scripts, copy), gulp.parallel(server, startWatch))
