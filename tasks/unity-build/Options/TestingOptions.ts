export default class TestingOptions {
    private _runEditorTests: boolean;
    private _editorTestsCategories: string;
    private _editorTestsFilter: string;
    private _editorTestsResults: string;

    public get runEditorTests(): boolean {
        return this._runEditorTests;
    }

    public set runEditorTests(value: boolean) {
        this._runEditorTests = value;
    }

    public get editorTestsCategories(): string {
        return this._editorTestsCategories;
    }

    public set editorTestsCategories(value: string) {
        this._editorTestsCategories = value;
    }

    public get editorTestsFilter(): string {
        return this._editorTestsFilter;
    }

    public set editorTestsFilter(value: string) {
        this._editorTestsFilter = value;
    }

    public get editorTestsResults(): string {
        return this._editorTestsResults;
    }

    public set editorTestsResults(value: string) {
        this._editorTestsResults = value;
    }
}