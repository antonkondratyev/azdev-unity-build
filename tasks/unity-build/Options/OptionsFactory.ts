import * as os from 'os';
import * as tl from 'vsts-task-lib/task';
import CommonOptions from './CommonOptions';
import TraceOptions from './TraceOptions';
import LoggingOptions from './LoggingOptions';
import PackageOptions from './PackageOptions';
import CachingOptions from './CachingOptions';
import TestingOptions from './TestingOptions';
import LicenseOptions from './LicenseOptions';
import AdvancedOptions from './AdvancedOptions';
import TaskOptions from './TaskOptions';

export default class OptionsFactory {

    public create(): TaskOptions {
        /*
         * Common Options
         */
        let commonOptions: CommonOptions = new CommonOptions();
        commonOptions.projectPath = tl.resolve(tl.getPathInput('projectPath', true));
        commonOptions.buildTarget = tl.getInput('buildTarget', false);
        commonOptions.executeMethod = tl.getInput('executeMethod', false);
        commonOptions.customArgs = tl.getDelimitedInput('customArgs', os.EOL, false);

        /*
         * Trace Options
         */
        let traceOptions: TraceOptions = new TraceOptions();
        let traceLevel: string = tl.getInput('traceLevel', true);
        traceOptions.setTraceLevelString(traceLevel);
        traceOptions.muteEmptyLines = tl.getBoolInput('muteEmptyLines', false);
        traceOptions.muteCompilerOutput = tl.getBoolInput('muteCompilerOutput', false);
        traceOptions.muteUpdatingGuid = tl.getBoolInput('muteUpdatingGuid', false);
        traceOptions.printMutedLinesInfo = tl.getBoolInput('printMutedLinesInfo', false);
        traceOptions.traceRulesSelector = tl.getInput('traceRulesSelector', false);
        traceOptions.traceRulesInline = tl.getInput('traceRulesInline', false);
        traceOptions.traceRulesFilePath = tl.getPathInput('traceRulesFilePath', false);

        /*
         * Logging Options
         */
        let loggingOptions: LoggingOptions = new LoggingOptions();
        loggingOptions.cleanedLogFile = tl.getInput('cleanedLogFile', false);
        loggingOptions.logFilePath = tl.getPathInput('logFilePath', false);

        /*
         * Package Options
         */
        let packageOptions: PackageOptions = new PackageOptions();
        packageOptions.importPackage = tl.getInput('importPackage', false);
        packageOptions.exportPackage = tl.getInput('exportPackage', false);
        packageOptions.exportPackageAssets = tl.getDelimitedInput('exportPackageAssets', os.EOL, false);

        /*
         * Caching Options
         */
        let cachingOptions: CachingOptions = new CachingOptions();
        cachingOptions.cacheServer = tl.getInput('cacheServer', false);
        cachingOptions.cacheServerAddress = tl.getInput('cacheServerAddress', false);
        cachingOptions.backupLibrary = tl.getBoolInput('backupLibrary', false);
        cachingOptions.backupLibraryPath = tl.resolve(tl.getPathInput('backupLibraryPath', true));
        cachingOptions.cleanScriptAssemblies = tl.getBoolInput('cleanScriptAssemblies', false);
        cachingOptions.cleanScriptMapper = tl.getBoolInput('cleanScriptMapper', false);

        /*
         * Testing Options
         */
        let testingOptions: TestingOptions = new TestingOptions();
        testingOptions.runEditorTests = tl.getBoolInput('runEditorTests', false);
        testingOptions.editorTestsCategories = tl.getInput('editorTestsCategories', false);
        testingOptions.editorTestsFilter = tl.getInput('editorTestsFilter', false);
        testingOptions.editorTestsResults = tl.getInput('editorTestsResults', false);

        /*
         * License Options
         */
        let licenseOptions: LicenseOptions = new LicenseOptions();
        licenseOptions.license = tl.getInput('license', false);
        licenseOptions.licenseSerial = tl.getInput('licenseSerial', false);
        licenseOptions.licenseUsername = tl.getInput('licenseUsername', false);
        licenseOptions.licensePassword = tl.getInput('licensePassword', false);
        licenseOptions.licenseReturn = tl.getBoolInput('licenseReturn', false);

        /*
         * Advanced Options
         */
        let advancedOptions: AdvancedOptions = new AdvancedOptions();
        advancedOptions.partiallySucceededOnOutputError = tl.getBoolInput('partiallySucceededOnOutputError', false);
        advancedOptions.failOnOutputError = tl.getBoolInput('failOnOutputError', false);
        advancedOptions.batchmode = tl.getBoolInput('batchmode', false);
        advancedOptions.nographics = tl.getBoolInput('nographics', false);
        advancedOptions.silentCrashes = tl.getBoolInput('silentCrashes', false);
        advancedOptions.quit = tl.getBoolInput('quit', false);
        advancedOptions.unityVersion = tl.getInput('unityVersion', false);
        advancedOptions.specificVersion = tl.getInput('specificVersion', false);
        advancedOptions.specificPath = tl.getPathInput('specificPath', false, false);

        /*
         * Task Options
         */
        let taskOptions: TaskOptions = new TaskOptions();
        taskOptions.common = commonOptions;
        taskOptions.trace = traceOptions;
        taskOptions.logging = loggingOptions;
        taskOptions.package = packageOptions;
        taskOptions.caching = cachingOptions;
        taskOptions.testing = testingOptions;
        taskOptions.license = licenseOptions;
        taskOptions.advanced = advancedOptions;

        return taskOptions;
    }
}