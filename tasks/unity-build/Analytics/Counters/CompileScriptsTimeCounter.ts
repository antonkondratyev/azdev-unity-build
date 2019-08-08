import Counter from './Counter';

export default class CompileScriptsTimeCounter implements Counter {
    private _startPattern: RegExp;
    private _finishPattern: RegExp = RegExp('Finished compile .+\\/(.+\\.dll)');
    private _tempList: { fileName: string, startTime: Date }[] = [];
    private _timeList: { fileName: string, duration: number }[] = [];

    constructor() {
        this._startPattern = RegExp('[Ss]tarting compile .+\\/(.+\\.dll)');
    }

    match(line: string): void {
        let match = line.match(this._startPattern);
        if (match) {
            this._tempList.push({ fileName: match[1], startTime: new Date() });
            return;
        }

        match = line.match(this._finishPattern);
        if (match) {
            let el = this._tempList.find((elem, i, arr) => {
                if (elem.fileName === match[1]) {
                    arr.splice(i, 1);
                    return true;
                }
                return false;
            });
            
            this._timeList.push({
                fileName: el.fileName,
                duration: this.duration(el.startTime, new Date())
            });
            return;
        }
    }

    private duration(start: Date, finish: Date): number {
        return finish >= start ? finish.getTime() - start.getTime() : null;
    }

    public getRecords() {
        return this._timeList;
    }

    public getNotFinishedCompiles() {
        return this._tempList;
    }
}