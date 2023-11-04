const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const post = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Imagenes
const imagemin  = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif')

const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano')

// creando mi primer archivo gulp
function css(done){

    // Compilar sass
    // pasos 1: - identificar archivo, 2 - Compilarla, 3 - Guradar el .css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe( sass() )
        .pipe( post([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') )
    done();
}

function dev(){
    // busca todos los archivos con extension scss, y valida si hay cambios
    watch( 'src/scss/**/*.scss', css );

    // Si agregamos una nueva imagen, es mejor colocar un watch la ruta y que se agreguen
    watch('src/img/**/*', imagenes);
    // watch( 'src/scss/app.scss', css );
}

// importar imagenes dentro de gulp
function imagenes(done){
    // Exportar todos los archivos que hay en la carpeta img
    src('src/img/**/*')
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe(dest('build/img'));

    done();
}

function versionWebp(){
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('build/img'))
}

function versionAvif(){

    const opciones = {
        quality: 50
    }

    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;

exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
// series - Se inicia una tarea y hasta que finaliza, inicia la siguiente
//parallel - Todas inician al mismo tiempo