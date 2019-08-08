export default class BuildTimeRow {
    public operation: string;
    public time: number;
    public count: number;
    public link: number;
    public hint: string;
    
    constructor(operation: string, time: number, count: number, hint: string) {
        this.operation = operation;
        this.time = time;
        this.count = count;
        this.hint = hint;
    }
}