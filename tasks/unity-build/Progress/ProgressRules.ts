import * as fs from 'fs';
import * as tl from 'vsts-task-lib/task';
import ProgressRule from './ProgressRule';

export default class ProgressRules {
    private _currentProgress: number = 0;
    private _rules: ProgressRule[];

    constructor(jsonPath: string) {
        this._rules = this.parseJson(fs.readFileSync(jsonPath, 'utf-8'));
    }

    get getProgress(): number {
        return this._currentProgress;
    }

    public setProgress(line: string): void {
        this._rules.forEach(rule => {
            if (line.match(rule.pattern) && (this._currentProgress < rule.percent)) {
                this._currentProgress = rule.percent;
                tl.command('task.setprogress', { value: rule.percent }, tl.loc('ProgressMessage', rule.pattern));
            }
        });
    }

    private parseJson(json: string): ProgressRule[] {
        let parsedRules: ProgressRule[] = JSON.parse(json, (key, value) => {
            if (key == 'pattern') return new RegExp(value, 'g');
            return value;
        });
        return parsedRules;
    }
}