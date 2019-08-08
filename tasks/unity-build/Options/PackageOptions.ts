export default class PackageOptions {
    private _importPackage: string;
    private _exportPackage: string;
    private _exportPackageAssets: string[];

    public get importPackage(): string {
        return this._importPackage;
    }

    public set importPackage(value: string) {
        this._importPackage = value;
    }

    public get exportPackage(): string {
        return this._exportPackage;
    }

    public set exportPackage(value: string) {
        this._exportPackage = value;
    }

    public get exportPackageAssets(): string[] {
        return this._exportPackageAssets;
    }

    public set exportPackageAssets(value: string[]) {
        this._exportPackageAssets = value;
    }
}