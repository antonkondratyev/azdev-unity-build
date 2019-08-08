export default class LoggingOptions {
    private _cleanedLogFile: string;
    private _logFilePath: string;

    public get cleanedLogFile(): string {
        return this._cleanedLogFile;
    }

    public set cleanedLogFile(value: string) {
        this._cleanedLogFile = value;
    }

    public get logFilePath(): string {
        return this._logFilePath;
    }

    public set logFilePath(value: string) {
        this._logFilePath = value;
    }
}