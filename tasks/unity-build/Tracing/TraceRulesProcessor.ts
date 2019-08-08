import * as tl from 'vsts-task-lib/task';
import * as tm from '../TaskMessages';
import CommonOptions from '../Options/CommonOptions';
import TraceOptions from '../Options/TraceOptions';
import TraceLevel from './TraceLevel';
import TraceRule from './TraceRule';
import TraceRules from './TraceRules';
import TraceRuleType from './TraceRuleType';

export default class TraceRulesProcessor {
    private readonly _commonOptions: CommonOptions;
    private readonly _traceOptions: TraceOptions;
    private _rules: TraceRules = new TraceRules();
    private _muteSection: boolean = false;
    private _muteReason: string = '';
    private _mutedLines: number = 0;
    private _mutedLinesTotal: number = 0;
    private _errorLines: number = 0;

    constructor(commonOptions: CommonOptions, traceOptions: TraceOptions) {
        this._commonOptions = commonOptions;
        this._traceOptions = traceOptions;
    }

    public get mutedLinesTotal(): number {
        return this._mutedLinesTotal;
    }

    public get errorLines(): number {
        return this._errorLines;
    }

    public setRules(traceRules: TraceRules): void {
        this._rules = traceRules;
    }

    public processRule(line: string): void {
        if (this._rules.some((rule: TraceRule) => {
            if (line.match(rule.pattern)) {
                return this.matchProcessing(line, rule);
            }
            return false;
        })) {
            return;
        }

        if (this._muteSection) {
            this._mutedLines++;
            tl.debug(line);
            return;
        }

        if (this._traceOptions.traceLevel === TraceLevel.All) {
            if (this._mutedLines > 0) {
                if (this._mutedLines > 2 && this._traceOptions.printMutedLinesInfo) {
                    console.log(tl.loc('MutedByReason', this._mutedLines, this._muteReason));
                }

                this._mutedLinesTotal += this._mutedLines;
                this._mutedLines = 0;
                this._muteReason = '';
            }
            console.log(line);
            return;
        }

        tl.debug(line);
    }

    private updateMuteReason(reason: string) {
        if (this._muteReason === '') {
            this._muteReason = reason;
            return;
        }

        if (this._muteReason.indexOf(reason) === -1) {
            this._muteReason += `, ${reason}`;
            return;
        }
    }

    private matchProcessing(line: string, rule: TraceRule): boolean {
        if (!rule.enabled) return false; // go to next match

        if (rule.type === TraceRuleType.Mute) {
            tl.debug(line);

            if (rule.countLine === undefined || rule.countLine === true) this._mutedLines++;
            if (rule.reason !== undefined) this.updateMuteReason(rule.reason);

            if (rule.muteSection !== undefined) {
                tl.debug(tl.loc('MuteSection', rule.muteSection));
                if (rule.muteSection === 'set') this._muteSection = true;
                if (rule.muteSection === 'reset') this._muteSection = false;
            }

            return true;
        }

        if (this._muteSection) {
            this._mutedLines++;
            tl.debug(line);
            return true;
        }

        if (this._mutedLines > 0) {
            if (this._mutedLines > 2 && this._traceOptions.printMutedLinesInfo) {
                console.log(tl.loc('MutedByReason', this._mutedLines, this._muteReason));
            }

            this._mutedLinesTotal += this._mutedLines;
            this._mutedLines = 0;
            this._muteReason = '';
        }

        switch (rule.type) {
            case TraceRuleType.Critical:
                tl.error(line);
                tl.setResult(tl.TaskResult.Failed, tl.loc('CriticalMessage'));
                return true;

            case TraceRuleType.CompilerOut:
                let regex = new RegExp(rule.pattern);
                let match = regex.exec(line);
                let sourcepath = tl.resolve(this._commonOptions.projectPath, match[1]);
                let linenumber = match[2];
                let columnnumber = match[3];
                let type = match[4];
                let code = match[5];
                let message = match[6];

                let properties = {
                    type: type,
                    sourcepath: sourcepath,
                    linenumber: linenumber,
                    columnnumber: columnnumber,
                    code: code
                };
                tl.command('task.logissue', properties, message);
                return true;

            case TraceRuleType.Error:
                tl.error(line);
                this._errorLines++;
                return true;

            case TraceRuleType.Warning:
                if (this._traceOptions.traceLevel !== TraceLevel.Error) {
                    tl.warning(line);
                    return true;
                }
                break;

            case TraceRuleType.Info:
                if (this._traceOptions.traceLevel !== TraceLevel.Error &&
                    this._traceOptions.traceLevel !== TraceLevel.Warning) {
                    console.log(`##[info]${line}`);
                    return true;
                }
                break;

            case TraceRuleType.Command:
                console.log(`##[command]${line}`);
                return true;
        }

        tl.debug(line);

        return true;
    }
}