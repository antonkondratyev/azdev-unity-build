import Counter from './Counter';

export default class CheckPrefabDependenciesTimeCounter implements Counter {
    private _startPattern: RegExp = RegExp('DisplayProgressbar: Checking prefab dependencies');
    private _checkTimePattern: RegExp = RegExp('CheckTime: (\\d+\\.\\d+)');
    private _waitCheckTime: boolean = false;
    private _timeList: { duration: number }[] = [];
    
    public match(line: string) {
        let match = line.match(this._startPattern);
        if (match) {
            this._waitCheckTime = true;
            return;
        }

        match = line.match(this._checkTimePattern);
        if (match && this._waitCheckTime) {
            this._timeList.push({ duration: Number(match[1]) });
            this._waitCheckTime = false;
            return;
        }
    }

    public getRecords() {
        return this._timeList;
    }
}