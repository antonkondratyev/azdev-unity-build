import BundleInfoCategory from './BundleInfoCategory';
import BundleInfoAsset from './BundleInfoAsset';

export default class BundleInfo {
    public name: string = '';
    public size?: number = 0;
    public category: BundleInfoCategory[] = [];
    public assets: BundleInfoAsset[] = [];
    
    constructor(init?: BundleInfo) {
        Object.assign(this, init);
    }
}