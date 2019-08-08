import * as tl from 'vsts-task-lib/task';

import DataContext from './DataContext';
import AnalyticResult from './AnalyticResult';
import Analyser from './Analysers/Analyser';
import UnityVersion from '../UnityVersion';

import UpdateAssetTimeCounter from './Counters/UpdateAssetTimeCounter';
import BuildingTimeCounter from './Counters/BuildingTimeCounter';
import CompileScriptsTimeCounter from './Counters/CompileScriptsTimeCounter';
import CodeStrippingTimeCounter from './Counters/CodeStrippingTimeCounter';
import Il2cppTimeCounter from './Counters/Il2cppTimeCounter';
import CheckPrefabDependenciesTimeCounter from './Counters/CheckPrefabDependenciesTimeCounter';
import BundleInfoCounter from './Counters/BundleInfoCounter';

import UpdateAssetAnalyser from './Analysers/UpdateAssetAnalyser';
import BuildingAnalyser from './Analysers/BuildingAnalyser';
import CompileScriptsAnalyser from './Analysers/CompileScriptsAnalyser';
import CodeStrippingAnalyser from './Analysers/CodeStrippingAnalyser';
import Il2cppAnalyser from './Analysers/Il2cppAnalyser';
import CheckPrefabDependenciesAnalyser from './Analysers/CheckPrefabDependenciesAnalyser';
import SummaryInfoAnalyser from './Analysers/SummaryInfoAnalyser';
import BundleInfoAnalyser from './Analysers/BundleInfoAnalyser';

export default class BuildAnalytics {
    private _dataContext: DataContext = new DataContext();
    private _analysers: Analyser[] = [];

    constructor() {
        this._dataContext.counters.push(new UpdateAssetTimeCounter());
        this._dataContext.counters.push(new BuildingTimeCounter());
        this._dataContext.counters.push(new CompileScriptsTimeCounter());
        this._dataContext.counters.push(new CodeStrippingTimeCounter());
        this._dataContext.counters.push(new Il2cppTimeCounter());
        this._dataContext.counters.push(new CheckPrefabDependenciesTimeCounter());
        this._dataContext.counters.push(new BundleInfoCounter());

        this._analysers.push(new UpdateAssetAnalyser());
        this._analysers.push(new BuildingAnalyser());
        this._analysers.push(new CompileScriptsAnalyser());
        this._analysers.push(new CodeStrippingAnalyser());
        this._analysers.push(new Il2cppAnalyser());
        this._analysers.push(new CheckPrefabDependenciesAnalyser());
        this._analysers.push(new SummaryInfoAnalyser());
        this._analysers.push(new BundleInfoAnalyser());
    }

    public process(line: string): void {
        this._dataContext.counters.forEach(counter => {
            try {
                counter.match(line);
            } catch (error) {
                console.log(error);
            }
        });
    }

    public get dataContext(): DataContext {
        return this._dataContext;
    }

    public get analysers(): Analyser[] {
        return this._analysers;
    }

    public get analyticResult(): AnalyticResult {
        let analyticResult = new AnalyticResult();
        this._analysers.forEach(analyser => {
            try {
                analyser.analyse(this._dataContext, analyticResult);
            } catch (error) {
                console.log(error);
            }
        });
        return analyticResult;
    }

    public saveResult(filePath: string): void {
        tl.writeFile(filePath, JSON.stringify(this.analyticResult));
    }

    public attachResult(filePath: string): void {
        tl.command('task.addattachment', { type: 'json', name: 'analyticResult' }, filePath);
    }

    public unityVersion(unityVersion: UnityVersion): void {
        this._dataContext.unityVersion = unityVersion;
    }

    public print(): void {
        console.log(JSON.stringify(this.analyticResult, null, 2));
    }
}