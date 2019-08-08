import * as os from 'os';
import * as fs from 'fs';
import * as tl from 'vsts-task-lib/task';
import SystemVariables from '../SystemVariables';
import CommonOptions from '../Options/CommonOptions';
import TraceOptions from '../Options/TraceOptions';
import TraceRuleType from './TraceRuleType';
import TraceRule from './TraceRule';
import TraceRules from './TraceRules';
import TraceRulesProcessor from './TraceRulesProcessor';

/**
 * Managing list of all Trace Rules
 */
export default class TraceRulesManager {
    private readonly _systemVariables: SystemVariables;
    private readonly _commonOptions: CommonOptions;
    private readonly _traceOptions: TraceOptions;
    private _rules: TraceRules = new TraceRules();

    constructor(systemVariables: SystemVariables, commonOptions: CommonOptions, traceOptions: TraceOptions) {
        this._systemVariables = systemVariables;
        this._commonOptions = commonOptions;
        this._traceOptions = traceOptions;
    }

    public get traceRules(): TraceRules {
        return this._rules;
    }

    /**
     * Adding or Updating trace rules from built-in rules. It's 'builtInTraceRules.json' file in '\tasks\unity-build\Tracing\' folder     
     */
    public addRulesFromBuiltIn(): void {
        let builtInRulesPath = tl.resolve(__dirname, 'builtInTraceRules.json');
        this.addRulesFromFile(builtInRulesPath);
    }

    public addRulesFromOptions(): void {
        let muteRules: TraceRules = [
            new TraceRule({ ruleId: 'muteEmptyLines', enabled: this._traceOptions.muteEmptyLines }),
            new TraceRule({ ruleId: 'muteCompilerCmdArgs', enabled: this._traceOptions.muteCompilerOutput }),
            new TraceRule({ ruleId: 'muteCompilerOutput', enabled: this._traceOptions.muteCompilerOutput }),
            new TraceRule({ ruleId: 'muteUpdatingGuid', enabled: this._traceOptions.muteUpdatingGuid })
        ];
        this.addRules(muteRules);

        if (this._traceOptions.traceRulesSelector === 'traceRulesInline' &&
            this._traceOptions.traceRulesInline !== null) {
            this.addRulesFromString(this._traceOptions.traceRulesInline);
            return;
        }

        if (this._traceOptions.traceRulesSelector === 'traceRulesFilePath' &&
            this._traceOptions.traceRulesFilePath !== this._systemVariables.sourcesDirectory) {
            this.addRulesFromFile(this._traceOptions.traceRulesFilePath);
            return;
        }
    }

    public addRulesFromString(rulesJson: string): void {
        this.addRules(this.parseJson(rulesJson));
    }

    public addRulesFromFile(filePath: string): void {
        let traceRulesJson: string = fs.readFileSync(filePath, 'utf-8');
        this.addRulesFromString(traceRulesJson);
    }

    public addRules(traceRules: TraceRules): void {
        traceRules.forEach((rule: TraceRule) => {
            if (rule.ruleId !== undefined) {
                let existRule: TraceRule = this._rules.find(r => r.ruleId === rule.ruleId);
                if (existRule) {
                    let clonedRule = Object.assign({}, existRule);
                    Object.assign(clonedRule, rule);
                    if (this.verifyRule(clonedRule, existRule)) {
                        tl.debug(`Rule has been updated from:\n${this.serializeRuleToJson(existRule)}`);
                        Object.assign(existRule, rule);
                        tl.debug(`to:\n${this.serializeRuleToJson(existRule)}\n`);
                    }
                    return;
                }
            }

            if (this.verifyRule(rule)) {
                this.normalizeRule(rule);
                this._rules.push(rule);
            }
        });
    }

    public createProcessor(): TraceRulesProcessor {
        let processor = new TraceRulesProcessor(this._commonOptions, this._traceOptions);
        processor.setRules(this._rules);
        return processor;
    }

    private verifyRule(rule: TraceRule, skipRule?: TraceRule): boolean {
        if (rule.type === undefined && rule.pattern === undefined) {
            tl.warning(`New rule can't be applied because doesn't have required "type" and "pattern" properties:`);
            console.log(this.serializeRuleToJson(rule, true), os.EOL);
            return false;
        }

        let existRule: TraceRule;
        let rulePattern = rule.pattern.toString();

        if (skipRule) {
            existRule = this._rules.find((r: TraceRule) => r !== skipRule && r.pattern.toString() === rulePattern);
        } else {
            existRule = this._rules.find((r: TraceRule) => r.pattern.toString() === rulePattern);
        }

        if (existRule) {
            tl.warning(`Rule with pattern '${rulePattern}' already exist in rule:`);
            console.log(this.serializeRuleToJson(existRule, true), os.EOL);
            return true;
        }

        return true;
    }

    private normalizeRule(rule: TraceRule): void {
        if (rule.enabled === undefined) {
            rule.enabled = true;
        }

        if (rule.countLine === undefined) {
            rule.countLine = true;
        }
    }

    private parseJson(json: string): TraceRules {
        return JSON.parse(json,
            (key: string, value: any) => {
                if (key === 'type') {
                    return TraceRuleType[value[0].toUpperCase() + value.substr(1)];
                }

                if (key === 'pattern') {
                    return new RegExp(value, 'g');
                }

                return value;
            }
        );
    }

    private serializeRuleToJson(rule: TraceRule, indented?: boolean): string {
        return JSON.stringify(rule,
            (key: string, value: any) => {
                if (key === 'type') {
                    return TraceRuleType[value].toLowerCase();
                }

                if (key === 'pattern') {
                    return value.toString();
                }
                
                return value;
            },
            indented ? 2 : null);
    }
}