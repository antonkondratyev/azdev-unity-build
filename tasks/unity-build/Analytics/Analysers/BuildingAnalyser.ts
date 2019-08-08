import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import BuildingTimeCounter from '../Counters/BuildingTimeCounter';
import BuildTimeRow from '../BuildTimeRow';

export default class BuildingAnalyser implements Analyser {
    analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(BuildingTimeCounter);
        let records = counter.getRecords();

        let recordsByPath = new Map<string, { time: number, count: number, hint: string }>();
        records.forEach(record => {
            let row = recordsByPath.get(record.message);
            if (row) {
                row.time += record.duration;
                row.count++;
            } else {
               recordsByPath.set(record.message, { time: record.duration, count: 1, hint: '' });
            }            
        });

        recordsByPath.forEach((value: { time: number, count: number, hint: string }, key: string) => {
            result.buildTimeByCategory.push(new BuildTimeRow(key, value.time, value.count, value.hint));
        });
    }
}