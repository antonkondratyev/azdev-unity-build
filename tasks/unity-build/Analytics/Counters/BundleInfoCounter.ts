import Counter from './Counter';
import BundleInfo from '../BundleInfo';

export default class BundleInfoCounter implements Counter {
    private _bundles: BundleInfo[] = [];
    private _currentBundle: BundleInfo;
    private _isBundleSection: boolean = false;
    
    private _reportPattern: RegExp = RegExp('^Build Report$');
    private _namePattern: RegExp = RegExp('Bundle Name: (.+)');
    private _sizePattern: RegExp = RegExp('Compressed Size:(\\d+\\.\\d) (mb|kb)');
    private _categoryPattern: RegExp = RegExp('^(\\w.+\\w)\\s+(\\d+\\.\\d) (mb|kb)\\s+(\\d+\\.\\d)%');
    private _assetPattern: RegExp = RegExp('(\\d+\\.\\d) (mb|kb)\\s+(\\d+\\.\\d)% (.+)');
    private _finishPattern: RegExp = RegExp('^-{70,}$');
    
    public match(line: string): void {
        let buildReport: RegExpMatchArray = line.match(this._reportPattern);
        if (buildReport) {
            this.initBundle('App Built-in Resource');
            return;
        }
        
        let bundleName: RegExpMatchArray = line.match(this._namePattern);
        if (bundleName) {
            this.initBundle(bundleName[1]);
            return;
        }
        
        let bundleSize: RegExpMatchArray = line.match(this._sizePattern);
        if (bundleSize && this._isBundleSection) {
            this._currentBundle.size = convertSizeInBytes(Number(bundleSize[1]), bundleSize[2]);
            return;
        }

        let bundleCategory: RegExpMatchArray = line.match(this._categoryPattern);
        if (bundleCategory && this._isBundleSection) {
            this._currentBundle.category.push({
                name: bundleCategory[1],
                size: convertSizeInBytes(Number(bundleCategory[2]), bundleCategory[3]),
                percent: Number(bundleCategory[4])
            });
            return;
        }

        let bundleAsset: RegExpMatchArray = line.match(this._assetPattern);
        if (bundleAsset && this._isBundleSection) {
            this._currentBundle.assets.push({
                size: convertSizeInBytes(Number(bundleAsset[1]), bundleAsset[2]),
                percent: Number(bundleAsset[3]),
                path: bundleAsset[4]
            });
            return;
        }

        let bundleFinish: RegExpMatchArray = line.match(this._finishPattern);
        if (bundleFinish && this._isBundleSection) {
            this._bundles.push(this._currentBundle);
            this._isBundleSection = false;
            return;
        }
    }

    private initBundle(bundleName: string): void {
        this._currentBundle = new BundleInfo();
        this._currentBundle.name = bundleName;
        this._isBundleSection = true;
    }
    
    public getRecords(): BundleInfo[] {
        return this._bundles;
    }
}

function convertSizeInBytes(size: number, unit: string): number {
    return unit === 'mb' ? size * 1024 * 1024 : unit === 'kb' ? size * 1024 : size;
}