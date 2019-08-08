export default class AssetBundlePathRow {
    public name: string;
    public path: string;
    public size: number;
    
    constructor(name: string, path: string, size: number) {
        this.name = name;
        this.path = path;
        this.size = size;
    }
}