import TraceLevel from '../Tracing/TraceLevel';

export default class TraceOptions {
    private _traceLevel: TraceLevel;
    private _muteEmptyLines: boolean;
    private _muteCompilerOutput: boolean;
    private _muteUpdatingGuid: boolean;
    private _printMutedLinesInfo: boolean;
    private _traceRulesSelector: string;
    private _traceRulesInline: string;
    private _traceRulesFilePath: string;

    public get traceLevel(): TraceLevel {
        return this._traceLevel;
    }

    public setTraceLevel(traceLevel: TraceLevel): void {
        this._traceLevel = traceLevel;
    }

    public setTraceLevelString(traceLevel: string): void {
        this._traceLevel = TraceLevel[traceLevel.substr(0, 1).toUpperCase() + traceLevel.substr(1)];
    }

    public get muteEmptyLines(): boolean {
        return this._muteEmptyLines;
    }

    public set muteEmptyLines(value: boolean) {
        this._muteEmptyLines = value;
    }

    public get muteCompilerOutput(): boolean {
        return this._muteCompilerOutput;
    }

    public set muteCompilerOutput(value: boolean) {
        this._muteCompilerOutput = value;
    }

    public get muteUpdatingGuid(): boolean {
        return this._muteUpdatingGuid;
    }

    public set muteUpdatingGuid(value: boolean) {
        this._muteUpdatingGuid = value;
    }

    public get printMutedLinesInfo(): boolean {
        return this._printMutedLinesInfo;
    }

    public set printMutedLinesInfo(value: boolean) {
        this._printMutedLinesInfo = value;
    }

    public get traceRulesSelector(): string {
        return this._traceRulesSelector;
    }

    public set traceRulesSelector(value: string) {
        this._traceRulesSelector = value;
    }

    public get traceRulesInline(): string {
        return this._traceRulesInline;
    }

    public set traceRulesInline(json: string) {
        this._traceRulesInline = json;
    }

    public get traceRulesFilePath(): string {
        return this._traceRulesFilePath;
    }

    public set traceRulesFilePath(filePath: string) {
        this._traceRulesFilePath = filePath;
    }
}