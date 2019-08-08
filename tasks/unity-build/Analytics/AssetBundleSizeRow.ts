export default class AssetBundleSizeRow {
    public name: string;
    public compressed: number;
    public uncompressed: number;
    
    constructor(name: string, compressed: number, uncompressed: number) {
        this.name = name;
        this.compressed = compressed;
        this.uncompressed = uncompressed;
    }
}