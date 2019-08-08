export default class CommonOptions {
    private _projectPath: string;
    private _buildTarget: string;
    private _executeMethod: string;
    private _customArgs: string[];

    public get projectPath(): string {
        return this._projectPath;
    }

    public set projectPath(value: string) {
        this._projectPath = value;
    }

    public get buildTarget(): string {
        return this._buildTarget;
    }

    public set buildTarget(value: string) {
        this._buildTarget = value;
    }

    public get executeMethod(): string {
        return this._executeMethod;
    }

    public set executeMethod(value: string) {
        this._executeMethod = value;
    }

    public get customArgs(): string[] {
        return this._customArgs;
    }

    public set customArgs(value: string[]) {
        this._customArgs = value;
    }
}