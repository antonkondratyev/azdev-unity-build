import * as tl from 'vsts-task-lib/task';
import SystemVariables from './SystemVariables';
import OptionsFactory from './Options/OptionsFactory';
import TaskOptions from './Options/TaskOptions';
import TraceRulesManager from './Tracing/TraceRulesManager';
import TraceRulesProcessor from './Tracing/TraceRulesProcessor';
import ProgressRules from './Progress/ProgressRules';
import BuildAnalytics from './Analytics/BuildAnalytics';
import LogWatcher from './LogWatcher';
import UnityEditor from './UnityEditor';
import UnityArgs from './UnityArgs';
import UnityVersion from './UnityVersion';

function main(): void {
    let unityEditor: UnityEditor;

    try {
        tl.setResourcePath(tl.resolve(__dirname, 'task.json'));

        let systemVariables: SystemVariables = new SystemVariables();

        let factory: OptionsFactory = new OptionsFactory();
        let options: TaskOptions = factory.create();

        let traceRulesManager: TraceRulesManager = new TraceRulesManager(systemVariables, options.common, options.trace);
        traceRulesManager.addRulesFromBuiltIn();
        traceRulesManager.addRulesFromOptions();

        let logWatcher: LogWatcher = new LogWatcher();
        let unityVersion: UnityVersion = new UnityVersion(options.advanced.unityVersion, options.advanced.specificVersion, options.advanced.specificPath, logWatcher);
        let analytics: BuildAnalytics = new BuildAnalytics();

        let progressRulesPath: string = tl.resolve(__dirname, 'Progress', 'progressRules.json');
        let progressRules: ProgressRules = new ProgressRules(progressRulesPath);

        let traceRulesProcessor: TraceRulesProcessor = traceRulesManager.createProcessor();

        logWatcher.on('line', (line: string): void => {
            try {
                progressRules.setProgress(line);
            } catch (err) {
                tl.error(err);
            }

            try {
                traceRulesProcessor.processRule(line);
            } catch (err) {
                tl.error(err);
            }

            try {
                analytics.process(line);
            } catch (err) {
                tl.error(err);
            }
        });

        let unityArgs: UnityArgs = new UnityArgs(options);
        unityEditor = new UnityEditor(unityVersion, unityArgs, options, systemVariables, logWatcher);

        //unityEditor.logs.on('line', () => {});

        unityEditor.on('closed', (code: number) => {
            if (traceRulesProcessor.mutedLinesTotal > 1) {
                console.log(tl.loc('AmountOfMutedLines', traceRulesProcessor.mutedLinesTotal, unityEditor.logFile.logWatcher.linesCount));
            }

            if (code === 0) {
                tl.debug(tl.loc('UnityExitCode', code));

                if (options.advanced.partiallySucceededOnOutputError && traceRulesProcessor.errorLines !== 0) {
                    tl.setResult(tl.TaskResult.SucceededWithIssues, tl.loc('PartiallySuccessful'));
                }
            } else {
                tl.setResult(tl.TaskResult.Failed, tl.loc('UnityExitCode', code));
            }

            try {
                let analyticResultPath: string = tl.resolve(systemVariables.artifactDirectory, 'analyticResult.json');
                analytics.unityVersion(unityVersion);
                analytics.saveResult(analyticResultPath);
                analytics.attachResult(analyticResultPath);
            } catch (error) {
                console.log(error);
            }

            process.exit();
        });

        process.on('SIGINT', () => {
            console.log(tl.loc('UnityInterrupted')); // TODO: rename UnityInterrupted to TaskInterrupted
            if (unityEditor && unityEditor.isRunning) unityEditor.stop();
        });

        unityEditor.start();

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err);
        if (unityEditor && unityEditor.isRunning) unityEditor.stop();
    }
}

process.on('warning', (warn: any) => tl.warning(warn));
process.on('uncaughtException', (err: Error) => tl.error(tl.loc('UncaughtException', err)));

main();