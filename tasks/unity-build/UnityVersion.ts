import * as fs from 'fs';
import * as path from 'path';
import * as find from 'find';
import * as xml2js from 'xml2js';
import * as tl from 'vsts-task-lib/task';
import * as tr from 'vsts-task-lib/toolrunner';
import LogWatcher from './LogWatcher';

export default class UnityVersion {
    private _unityVersionPattern: RegExp = RegExp('Initialize engine version: (\\d+\\.\\d+\\.\\w+)');
    private _unityVersion: string = '';
    private _unityPath: string;

    constructor(unityVersionInput: string, specificVersion: string, specificPath: string, watcher?: LogWatcher) {
        this._unityPath = tl.which(this.getUnityPath(unityVersionInput, specificVersion, specificPath), true);
        this._unityVersion = this.getUnityVersion(this._unityPath);

        if (watcher) {
            let getVersion = (line: string) => {
                let match = line.match(this._unityVersionPattern);
                if (match) {
                    if (this._unityVersion !== '' && this._unityVersion !== match[1]) {
                        tl.error(`Version of installed Unity ${this._unityPath} is '${this._unityVersion}' but is different from the version '${match[1]}' from the Unity log file.`);
                    }
                    this._unityVersion = match[1];
                    watcher.removeListener('line', getVersion);
                }
            }
            watcher.on('line', getVersion);
        }
    }

    public get versionWildcard(): string {
        return this._unityVersion;
    }

    public get versionHighest(): string {
        return this._unityVersion;
    }

    public get editorVersion(): string {
        return this._unityVersion;
    }

    public get editorPath(): string {
        return this._unityPath;
    }

    public getPathHighest(): string {
        return this._unityPath;
    }

    public lessThen(version: string): boolean {
        return false;
        // let is2017 = version === "2017";
        // let currentIs2017 = this._unityVersionInput === "latest";
        // return is2017 !== currentIs2017;
    }

    public moreThan(version: string): boolean {
        return true;
        // return version >= this._unityVersionInput ? true : false;
    }

    private getUnityPath(unityVersionInput: string, specificVersion: string, specificPath: string): string {
        switch (unityVersionInput) {
            case 'latest':
                return process.env.unity;

            case 'specificVersion':
                return process.env[`unity_${specificVersion.toLowerCase()}`];

            case 'specificPath':
                return specificPath;

            default:
                throw new Error(`${unityVersionInput} isn't implemented.`);
        }
    }

    private getUnityVersion(unityPath: string): string {
        switch (process.platform) {
            case 'darwin':
                let plistReader: tr.ToolRunner = tl.tool('defaults');
                plistReader.arg(['read', unityPath.replace('MacOS/Unity', 'Info.plist'), 'CFBundleVersion']);
                return plistReader.execSync({ silent: true } as tr.IExecSyncOptions).stdout.trim();

            case 'win32':
                let version: string = '';
                let ivyPath: string = find.fileSync('ivy.xml', path.join(path.dirname(unityPath), 'Data', 'PackageManager')).join();
                let xmlParser: xml2js.Parser = new xml2js.Parser();
                xmlParser.parseString(fs.readFileSync(ivyPath, 'utf8'), (err: string, result: string) => {
                    version = result['ivy-module'].info[0].$['e:unityVersion'];
                });
                return version;

            default:
                // get version via watcher
        }
    }
}