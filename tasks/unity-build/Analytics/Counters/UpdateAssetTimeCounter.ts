import Counter from './Counter';
import UpdateAssetTimeCounterListRecord from './UpdateAssetTimeCounterListRecord';

export default class UpdateAssetTimeCounter implements Counter {
    private _startPattern: RegExp;
    private _donePattern: RegExp;
    private _path: string;
    private _ext: string;
    private _guid: string;
    private _time: number;
    private _timeList: UpdateAssetTimeCounterListRecord[];

    constructor() {
        this._startPattern = RegExp('Updating (.+(\\..+)|.+) - GUID: (.+)\\.\\.\\.');
        this._donePattern = RegExp('done\\. \\[Time: (\\d+\\.\\d+) ms\\]');
        this._timeList = [];
    }

    public match(line: string): void {
        let match = line.match(this._startPattern);
        if (match) {
            this._path = match[1];
            this._ext = String(match[2]).toLowerCase();
            this._guid = match[3];
            return;
        }

        match = line.match(this._donePattern);
        if (match) {
            this._time = Number(match[1]);
            this._timeList.push({
                path: this._path,
                extension: this._ext,
                guid: this._guid,
                duration: this._time
            });
            return;
        }
    }

    public getRecords(): UpdateAssetTimeCounterListRecord[] {
        return this._timeList;
    }
}