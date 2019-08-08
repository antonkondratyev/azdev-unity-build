import Counter from './Counter';
import BuildingTimeCounterListRecord from './BuildingTimeCounterListRecord';

export default class BuildingTimeCounter implements Counter {
    private _startPattern: RegExp = RegExp('DisplayProgressbar: (.+)');
    private _startTime: Date = null;
    private _finishTime: Date = null;
    private _message: string = null;
    private _timeList: BuildingTimeCounterListRecord[] = [];
    private _waitFinish: boolean = false;

    public match(line: string): void {
        if (this._waitFinish) {
            this.setFinish(new Date());
        }

        let match = line.match(this._startPattern);
        if (match) {
            this._startTime = new Date();
            this._finishTime = null;
            this._message = match[1];
            this._waitFinish = true;
            return;
        }
    }

    public getRecords(): BuildingTimeCounterListRecord[] {
        return this._timeList;
    }

    private setFinish(finishTime: Date): void {
        if (this._waitFinish && this._message && finishTime >= this._startTime) {
            this._finishTime = finishTime;
            this._timeList.push({ message: this._message, duration: this.duration });
            this.dropCurrent();
            this._waitFinish = false;
        }
    }

    private get duration(): number {
        if (this._startTime && this._finishTime) {
            return this._finishTime.getTime() - this._startTime.getTime();
        } else {
            return null;
        }
    }

    private dropCurrent(): void {
        this._startTime = null;
        this._finishTime = null;
        this._message = null;
    }
}