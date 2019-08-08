import * as child from 'child_process';
import * as events from 'events';
import * as tl from 'vsts-task-lib/task';
import LogWatcher from './LogWatcher';
import UnityArgs from './UnityArgs';
import UnityLibrary from './UnityLibrary';
import UnityVersion from './UnityVersion';
import UnityLogFile from './UnityLogFile';
import TaskOptions from './Options/TaskOptions';
import SystemVariables from './SystemVariables';

export default class UnityEditor extends events.EventEmitter {
    private _process: child.ChildProcess;
    private _library: UnityLibrary;
    private _version: UnityVersion;
    private _logFile: UnityLogFile;
    private _args: UnityArgs;

    constructor(version: UnityVersion, args: UnityArgs, options: TaskOptions, systemVariables: SystemVariables, watcher: LogWatcher) {
        super();

        this._args = args;
        this._version = version;

        this._logFile = new UnityLogFile(options.logging.logFilePath, systemVariables, watcher);
        this._logFile.watchFile();

        this._library = new UnityLibrary(options.common.projectPath, options.caching);
    }

    public get logFile(): UnityLogFile {
        return this._logFile;
    }

    public get pid(): number {
        return this._process.pid;
    }

    public get isRunning(): boolean {
        return this._process !== undefined;
    }

    public start(): void {
        if (this.isRunning)
            throw 'UnityEditor launcher can support only one process instance at the same time.';

        this._library.restore();
        this._library.cleanScriptAssemblies();
        this._library.cleanScriptMapper();

        console.log(`##[command]${this._version.editorPath} ${this._args.getArgs().join(' ')}`);

        let spawnOptions: child.SpawnOptions = { detached: false };
        this._process = child.spawn(this._version.editorPath, this._args.getArgs().join(' ').split(' '), spawnOptions);

        this._process.on('close', (code: number, signal: string) => this.onProcessClosed(code, signal));
        this._process.on('error', (error: any) => tl.error(`Error: ${error}`));

        this._logFile.startWatch(this._process.stdout, this._process.stderr);
    }

    public stop(): void {
        if (!this.isRunning)
            throw 'The UnityEditor was not started.';

        console.log(tl.loc('UnityTerminating'));
        tl.debug(tl.loc('UnityTerminatingPid', this._process.pid));
        this._process.kill();
    }

    private onProcessClosed(code: number, signal: string): void {
        if (code === null) code = -1;

        this._process = undefined;

        console.log(tl.loc('UnityTerminated'));

        this._logFile.close();
        this._library.backup();

        this.emit('closed', code);
    }
}