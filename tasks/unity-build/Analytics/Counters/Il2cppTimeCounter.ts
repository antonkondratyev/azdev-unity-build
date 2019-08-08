import Counter from './Counter';

export default class Il2cppTimeCounter implements Counter {
    private _pattern: RegExp = RegExp('.+il2cpp\\.exe exited after (\\d+) ms\\.');
    private _timeList: { duration: number }[] = [];

    match(line: string): void {
        let match = line.match(this._pattern);
        if (match) {
            this._timeList.push({ duration: Number(match[1]) });
        }
    }

    public getRecords() {
        return this._timeList;
    }
}