export default class AdvancedOptions {
    private _partiallySucceededOnOutputError: boolean;
    private _failOnOutputError: boolean;
    private _batchmode: boolean;
    private _nographics: boolean;
    private _silentCrashes: boolean;
    private _quit: boolean;
    private _unityVersion: string;
    private _specificVersion: string;
    private _specificPath: string;

    public get partiallySucceededOnOutputError(): boolean {
        return this._partiallySucceededOnOutputError;
    }

    public set partiallySucceededOnOutputError(value: boolean) {
        this._partiallySucceededOnOutputError = value;
    }

    public get failOnOutputError(): boolean {
        return this._failOnOutputError;
    }

    public set failOnOutputError(value: boolean) {
        this._failOnOutputError = value;
    }

    public get batchmode(): boolean {
        return this._batchmode;
    }

    public set batchmode(value: boolean) {
        this._batchmode = value;
    }

    public get nographics(): boolean {
        return this._nographics;
    }

    public set nographics(value: boolean) {
        this._nographics = value;
    }

    public get silentCrashes(): boolean {
        return this._silentCrashes;
    }

    public set silentCrashes(value: boolean) {
        this._silentCrashes = value;
    }

    public get quit(): boolean {
        return this._quit;
    }

    public set quit(value: boolean) {
        this._quit = value;
    }

    public get unityVersion(): string {
        return this._unityVersion;
    }

    public set unityVersion(value: string) {
        this._unityVersion = value;
    }

    public get specificVersion(): string {
        return this._specificVersion;
    }

    public set specificVersion(value: string) {
        this._specificVersion = value;
    }

    public get specificPath(): string {
        return this._specificPath;
    }

    public set specificPath(value: string) {
        this._specificPath = value;
    }
}