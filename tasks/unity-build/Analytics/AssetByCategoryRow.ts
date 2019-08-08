export default class BuildSizeByCategoryRow {
    public category: string;
    public size: number;
    public percent: number;
    
    constructor(category: string, size: number, percent: number) {
        this.category = category;
        this.size = size;
        this.percent = percent;
    }
}