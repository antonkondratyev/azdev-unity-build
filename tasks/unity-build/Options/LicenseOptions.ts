export default class LicenseOptions {
    private _license: string;
    private _licenseSerial: string;
    private _licenseUsername: string;
    private _licensePassword: string;
    private _licenseReturn: boolean;

    public get license(): string {
        return this._license;
    }

    public set license(value: string) {
        this._license = value;
    }

    public get licenseSerial(): string {
        return this._licenseSerial;
    }

    public set licenseSerial(value: string) {
        this._licenseSerial = value;
    }

    public get licenseUsername(): string {
        return this._licenseUsername;
    }

    public set licenseUsername(value: string) {
        this._licenseUsername = value;
    }

    public get licensePassword(): string {
        return this._licensePassword;
    }

    public set licensePassword(value: string) {
        this._licensePassword = value;
    }

    public get licenseReturn(): boolean {
        return this._licenseReturn;
    }

    public set licenseReturn(value: boolean) {
        this._licenseReturn = value;
    }
}