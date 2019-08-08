export default class CachingOptions {
    private _cacheServer: string;
    private _cacheServerAddress: string;
    private _backupLibrary: boolean;
    private _backupLibraryPath: string;
    private _cleanScriptAssemblies: boolean;
    private _cleanScriptMapper: boolean;

    public get cacheServer(): string {
        return this._cacheServer;
    }

    public set cacheServer(value: string) {
        this._cacheServer = value;
    }

    public get cacheServerAddress(): string {
        return this._cacheServerAddress;
    }

    public set cacheServerAddress(value: string) {
        this._cacheServerAddress = value;
    }

    public get backupLibrary(): boolean {
        return this._backupLibrary;
    }

    public set backupLibrary(value: boolean) {
        this._backupLibrary = value;
    }

    public get backupLibraryPath(): string {
        return this._backupLibraryPath;
    }

    public set backupLibraryPath(value: string) {
        this._backupLibraryPath = value;
    }

    public get cleanScriptAssemblies(): boolean {
        return this._cleanScriptAssemblies;
    }

    public set cleanScriptAssemblies(value: boolean) {
        this._cleanScriptAssemblies = value;
    }

    public get cleanScriptMapper(): boolean {
        return this._cleanScriptMapper;
    }

    public set cleanScriptMapper(value: boolean) {
        this._cleanScriptMapper = value;
    }
}