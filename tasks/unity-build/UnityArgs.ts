import TaskOptions from './Options/TaskOptions';

export default class UnityArgs {
    private _args: string[] = [];
    private _logFilePath: string;
    private _projectPath: string;

    constructor(options: TaskOptions) {
        this._projectPath = options.common.projectPath;

        this.setArgIf(options.common.projectPath !== null, `-projectPath ${options.common.projectPath}`);
        this.setArgIf(options.common.buildTarget !== null && options.common.buildTarget !== 'none', `-buildTarget ${options.common.buildTarget}`);
        this.setArgIf(options.common.executeMethod !== null, `-executeMethod ${options.common.executeMethod}`);
        // this.setArgIf(options.common.customArgs !== null, `${options.common.customArgs}`);

        if (options.common.customArgs !== null) this.setArg(options.common.customArgs);

        this.setArgIf(options.advanced.batchmode, '-batchmode');
        this.setArgIf(options.advanced.nographics, '-nographics');
        this.setArgIf(options.advanced.silentCrashes, '-silentCrashes');
        this.setArgIf(options.advanced.quit, '-quit');

        this._logFilePath = options.logging.logFilePath;

        this.setArg('-logFile');
        this.setArgIf(process.platform === 'win32', options.logging.logFilePath);
        this.setArgIf(options.logging.cleanedLogFile !== null && options.logging.cleanedLogFile !== 'default', `-cleanedLogFile ${options.logging.cleanedLogFile}`);
        this.setArgIf(options.package.importPackage !== null, `-importPackage ${options.package.importPackage}`);

        if (options.package.exportPackage !== null && options.package.exportPackageAssets !== null) {
            let assets: string = '';
            options.package.exportPackageAssets.forEach(asset => assets += asset + ' ');
            this.setArg(`-exportPackage ${assets}${options.package.exportPackage}`);
        }

        if (options.testing.runEditorTests) {
            this.setArgIf(options.testing.runEditorTests, '-runEditorTests');
            this.setArgIf(options.testing.editorTestsCategories !== null, `-editorTestsCategories ${options.testing.editorTestsCategories}`);
            this.setArgIf(options.testing.editorTestsFilter !== null, `-editorTestsFilter ${options.testing.editorTestsFilter}`);
            this.setArgIf(options.testing.editorTestsResults !== null, `-editorTestsResultFile ${options.testing.editorTestsResults}`);
        }

        if (options.license.license === 'forceActivate') {
            this.setArgIf(options.license.licenseSerial !== null, `-serial ${options.license.licenseSerial}`);
            this.setArgIf(options.license.licenseUsername !== null, `-username ${options.license.licenseUsername}`);
            this.setArgIf(options.license.licensePassword !== null, `-password ${options.license.licensePassword}`);
            this.setArgIf(options.license.licenseReturn, '-returnlicense');
        }

        this.setArgIf(options.license.license === 'forceFree', '-force-free');
    }

    public setArg(value: string | string[]) {
        if (!value) return;

        if (value instanceof Array) {
            this._args = this._args.concat(value);
        } else if (typeof(value) === 'string') {
            this._args = this._args.concat(value.trim());
        }

        return this;
    }

    public setArgIf(condition: any, value: any) {
        if (condition) this.setArg(value);
        return this;
    }

    public getArgs(): string[] {
        return this._args;
    }

    public get logFilePath(): string {
        return this._logFilePath;
    }

    public get projectPath(): string {
        return this._projectPath;
    }
}