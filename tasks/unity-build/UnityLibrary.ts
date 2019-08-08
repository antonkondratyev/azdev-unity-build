import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import CachingOptions from './Options/CachingOptions';

export default class UnityLibrary {
    private _unityLibraryPath: string;
    private _backupLibraryPath: string;
    private _backupLibraryEnable: boolean;
    private _cleanScriptAssemblies: boolean;
    private _cleanScriptMapper: boolean;

    constructor(projectPath: string, cachingOptions: CachingOptions) {
        let unityLibraryPath: string = tl.resolve(projectPath, 'Library');

        this._backupLibraryEnable = cachingOptions.backupLibrary;

        this.setCleanScriptAssemblies(cachingOptions.cleanScriptAssemblies);
        this.setCleanScriptMapper(cachingOptions.cleanScriptMapper);

        this._unityLibraryPath = unityLibraryPath;
        this._backupLibraryPath = cachingOptions.backupLibraryPath;
    }

    public get backupEnable(): boolean {
        return this._backupLibraryEnable;
    }

    public setCleanScriptAssemblies(cleanScriptAssemblies: boolean): void {
        this._cleanScriptAssemblies = cleanScriptAssemblies;
    }

    public setCleanScriptMapper(cleanScriptMapper: boolean): void {
        this._cleanScriptMapper = cleanScriptMapper;
    }

    public backup(): void {
        if (!this.backupEnable) return;

        let srcFolder: string = this._unityLibraryPath;
        let dstFolder: string = this._backupLibraryPath;

        tl.debug(tl.loc('UnityLibraryBackuping', srcFolder, dstFolder));

        if (!tl.exist(srcFolder)) return;

        try {
            if (tl.exist(dstFolder)) tl.rmRF(dstFolder);

            // Read more about ENOENT and EPERM: http://man7.org/linux/man-pages/man2/rename.2.html
            let backupLibraryDirectory: string = path.parse(dstFolder).dir;
            if (!tl.exist(backupLibraryDirectory)) tl.mkdirP(backupLibraryDirectory);

            fs.renameSync(srcFolder, dstFolder);

            console.log(tl.loc('UnityLibraryBackupSuccess', dstFolder));
        } catch (err) {
            console.log(tl.loc('UnityLibraryBackupFail'));
            tl.error(err);
        }
    }

    public restore(): void {
        if (!this.backupEnable) return;

        let srcFolder: string = this._backupLibraryPath;
        let dstFolder: string = this._unityLibraryPath;

        tl.debug(tl.loc('UnityLibraryRestoring', srcFolder, dstFolder));

        if (!tl.exist(srcFolder)) return;

        try {
            if (tl.exist(dstFolder)) tl.rmRF(dstFolder);

            fs.renameSync(srcFolder, dstFolder);

            console.log(tl.loc('UnityLibraryRestoreSuccess', srcFolder));
        } catch (err) {
            console.log(tl.loc('UnityLibraryRestoreFail'));
            tl.error(err);
        }
    }

    public cleanScriptAssemblies(): void {
        let scriptAssembliesFolder: string = tl.resolve(this._unityLibraryPath, 'ScriptAssemblies');

        if (this._cleanScriptAssemblies && tl.exist(scriptAssembliesFolder)) {
            console.log(tl.loc('CleaningScriptAssemblies'));
            tl.rmRF(scriptAssembliesFolder);
        }
    }

    public cleanScriptMapper(): void {
        let scriptMapperFile: string = tl.resolve(this._unityLibraryPath, 'ScriptMapper');

        if (this._cleanScriptMapper && tl.exist(scriptMapperFile)) {
            console.log(tl.loc('CleaningScriptMapper'));
            tl.rmRF(scriptMapperFile);
        }
    }
}