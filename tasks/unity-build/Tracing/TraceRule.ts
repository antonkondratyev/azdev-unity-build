import TraceRuleType from './TraceRuleType';

export default class TraceRule {
    /**
     * Sets how to display such lines
     */
    type: TraceRuleType;

    /**
     * Sets selection pattern
     */
    pattern: RegExp;

    /**
     * Displays reason for muted lines
     */
    reason?: string;

    /**
     * Sets unique id for accessing later
     */
    ruleId?: string;

    /**
     * Enables this rule
     */
    enabled: boolean = true;

    /**
     * Sets or resets block of muted lines
     */
    muteSection?: string;

    /**
     * Sets whether to count such lines
     */
    countLine: boolean = true;
    
    /**
     * Sets which version of Unity is applicable. Supports wildcards
     */
    version?: string;

    constructor(init?: Partial<TraceRule>) {
        Object.assign(this, init);
    }
}