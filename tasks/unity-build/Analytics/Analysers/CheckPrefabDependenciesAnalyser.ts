import Analyser from './Analyser';
import DataContext from '../DataContext';
import BuildTimeRow from '../BuildTimeRow';
import AnalyticResult from '../AnalyticResult';
import CheckPrefabDependenciesTimeCounter from '../Counters/CheckPrefabDependenciesTimeCounter';

export default class CheckPrefabDependenciesAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(CheckPrefabDependenciesTimeCounter);
        let records = counter.getRecords();

        let time: number = 0;
        let count: number = 0;
        let hint: string = '';

        records.forEach(record => {
            time += record.duration;
            count++;
        });

        result.buildTimeByCategory.push(new BuildTimeRow('Checking Prefab Dependencies', time, count, hint));
    }
}