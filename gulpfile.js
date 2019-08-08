var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var install = require('gulp-install');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var del = require('del');

var EXTENSIONS_DIR = 'extensions';
var BUILD_DIR = '_build';
var TASKS_DIR = 'tasks';

var metadata = {
    task: [
        '!**/node_modules/**/*',
        'vss-extension.json',
        'images/*.png',
        'LICENSE',
        'README.md',
        'scripts/*',
        'tasks/**/{*.png,*.json}'
    ],
    extension: [
        '**/*.html',
        '**/VSS.*.js'
    ]
}

function getFoldersFrom(folder) {
    let listFolders = [];
    let rootFolderPath = path.resolve(__dirname, folder);
    fs.readdirSync(rootFolderPath).forEach(folderName => {
        let folderPath = path.join(rootFolderPath, folderName);
        if (fs.statSync(folderPath).isDirectory()) listFolders.push(folderPath);
    });
    return listFolders;
}

var tasks = fs.readdirSync(TASKS_DIR).filter(taskName => fs.statSync(path.join(TASKS_DIR, taskName)).isDirectory());
var extensions = fs.readdirSync(EXTENSIONS_DIR).filter(extName => fs.statSync(path.join(EXTENSIONS_DIR, extName)).isDirectory());

gulp.task('install_ext_deps', done => {
    extensions.filter(extName => fs.existsSync(path.join(__dirname, EXTENSIONS_DIR, extName, 'package.json'))).forEach(extName => {
        gulp.src('package.json', { cwd: path.join(EXTENSIONS_DIR, extName) })
            .pipe(install());
    });
    done();
});

gulp.task('install_task_deps', done => {
    tasks.filter(taskName => fs.existsSync(path.join(__dirname, TASKS_DIR, taskName, 'package.json'))).forEach(taskName => {
        gulp.src('package.json', { cwd: path.join(TASKS_DIR, taskName) })
            .pipe(install());
    });
    done();
});

gulp.task('install_prod_deps', done => {
    tasks.filter(taskName => fs.existsSync(path.join(__dirname, TASKS_DIR, taskName, 'package.json'))).forEach(taskName => {
        gulp.src('package.json', { cwd: path.join(TASKS_DIR, taskName) })
            .pipe(gulp.dest(path.join(BUILD_DIR, TASKS_DIR, taskName)))
            .pipe(install({ production: true }));
    });
    done();
});

gulp.task('make_exts', done => {
    // gulp.src(paths.extension.src, { cwd: EXTENSIONS_DIR })
    //     .pipe(tsc(paths.extension.dir + 'tsconfig.json'))
    //     .pipe(rename(p => {
    //         if (p.dirname.endsWith('src')) p.dirname = p.dirname.replace('src', 'scripts');
    //     }))
    //     .pipe(gulp.dest(BUILD_DIR));
    done();
});

gulp.task('make_tasks', done => {
    tasks.filter(taskName => fs.existsSync(path.join(__dirname, TASKS_DIR, taskName, 'tsconfig.json'))).forEach(taskName => {
        var tsProject = tsc.createProject(path.join(TASKS_DIR, taskName, 'tsconfig.json'));
        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.', { sourceRoot: path.join(__dirname, TASKS_DIR, taskName), includeContent: false }))
            .pipe(gulp.dest(path.join(BUILD_DIR, TASKS_DIR, taskName)));
    });
    done();
});

gulp.task('copy_metadata', done => {
    gulp.src(metadata.task, { base: __dirname })
        .pipe(gulp.dest(BUILD_DIR));

    gulp.src(metadata.extension, { cwd: EXTENSIONS_DIR })
        .pipe(gulp.dest(BUILD_DIR));

    done();
});

gulp.task('patch_dev', done => {
    var config = require('./config.json');

    tasks.forEach(taskName => {
        var taskJson = path.join(__dirname, BUILD_DIR, TASKS_DIR, taskName, 'task.json');
        if (fs.existsSync(taskJson)) {
            var task = require(taskJson);
            task.id = config.env.dev.tasks[0].id;
            task.name = config.env.dev.tasks[0].name;
            task.friendlyName = config.env.dev.tasks[0].friendlyName;
            fs.writeFileSync(taskJson, JSON.stringify(task, null, 2));
        }
    });

    var manifestFile = path.join(__dirname, BUILD_DIR, 'vss-extension.json');
    var manifest = require(manifestFile);
    manifest.id = config.env.dev.manifest.id;
    manifest.name = config.env.dev.manifest.name;
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

    done();
});

gulp.task('clean', () => {
    return del(BUILD_DIR);
});

gulp.task('clean_prod', () => {
    return del(`${BUILD_DIR}/**/{package*.json,tsconfig.json,*.map,*.d.ts,_test*}`);
});

gulp.task('package', done => {
    // tfx extension create
    done();
});

gulp.task('install', gulp.parallel('install_ext_deps', 'install_task_deps', 'install_prod_deps'));
gulp.task('make', gulp.parallel('make_exts', 'make_tasks'));
gulp.task('build', gulp.series('make', 'copy_metadata'));
gulp.task('build_dev', gulp.series('make', 'copy_metadata', 'patch_dev'));
gulp.task('default', gulp.series('clean', 'install', 'build', 'package'));