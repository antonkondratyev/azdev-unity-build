import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import LogWatcher from './LogWatcher';
import SystemVariables from './SystemVariables';

export default class UnityLogFile {
    private _filePath: string;
    private _tempFilePath: string;
    private _systemVariables: SystemVariables;
    private _logWatcher: LogWatcher;

    constructor(logFilePath: string, systemVariables: SystemVariables, watcher: LogWatcher) {
        this._systemVariables = systemVariables;
        this._logWatcher = watcher;

        if (logFilePath === null || logFilePath === systemVariables.sourcesDirectory) {
            let tempDirPath: string = tl.resolve(os.tmpdir(), systemVariables.teamProject);
            tl.mkdirP(tempDirPath);

            this._tempFilePath = tl.resolve(fs.mkdtempSync(tempDirPath + path.sep), 'unity.log');
            this._filePath = this._tempFilePath;
        } else {
            this._filePath = tl.resolve(logFilePath);
            tl.mkdirP(path.dirname(this._filePath));
        }
        tl.debug(tl.loc('UnityLogPath', this._filePath));

        if (!tl.exist(this._filePath)) tl.writeFile(this._filePath, '');
    }

    public watchFile(): void {
        if (process.platform === 'win32') {
            this._logWatcher.watchFileBuffer(this._filePath, tl.loc('UnityLogListenStarted'));

            setInterval(() => {
                fs.stat(this._filePath, () => {});
            }, 200);
        }
    }

    public startWatch(stdout: any, stderr: any): void {
        stdout.setEncoding('utf8').on('data', (stdout: any) => {
            if (process.platform === 'win32') {
                console.log(tl.loc('UnityStdOut', stdout));
            } else {
                this._logWatcher.watchLines(stdout);
                fs.appendFileSync(this._filePath, stdout);
            }
        });

        stderr.setEncoding('utf8').on('data', (stderr: any) => tl.error(tl.loc('UnityStdErr', stderr)));
    }

    public close(): void {
        if (process.platform === 'win32') this._logWatcher.close(tl.loc('UnityLogListenStopped'));

        if (tl.exist(this._filePath) && !tl.exist(tl.resolve(this._systemVariables.artifactDirectory, path.basename(this._filePath)))) {
            tl.debug(tl.loc('CopyLogFile', this._filePath, this._systemVariables.artifactDirectory));

            try {
                tl.mkdirP(this._systemVariables.artifactDirectory);
                tl.cp(this._filePath, this._systemVariables.artifactDirectory, '-f');
            } catch (err) {
                tl.debug(tl.loc('CopyLogFileFailed', this._filePath, this._systemVariables.artifactDirectory, err.message));
            }
        }

        if (tl.exist(this._tempFilePath)) tl.rmRF(path.dirname(this._tempFilePath));
    }

    public get logWatcher(): LogWatcher {
        return this._logWatcher;
    }

    public getPath(): string {
        return this._filePath;
    }
}