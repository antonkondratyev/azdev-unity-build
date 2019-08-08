import Analyser from './Analyser';
import DataContext from '../DataContext';
import BuildTimeRow from '../BuildTimeRow';
import AnalyticResult from '../AnalyticResult';
import UpdateAssetTimeCounter from '../Counters/UpdateAssetTimeCounter';

export default class UpdateAssetAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(UpdateAssetTimeCounter);
        let records = counter.getRecords();
        let totalTime: number = 0;
        let totalCount: number = 0;

        let recordsByType = new Map<string, { time: number, count: number, hint: string }>();
        let recordsByPath = new Map<string, { time: number, count: number, hint: string }>();
        records.forEach(record => {
            let typeRow = recordsByType.get(record.extension);
            if (typeRow) {
                typeRow.time += record.duration;
                typeRow.count++;
            } else {
               recordsByType.set(record.extension, { time: record.duration, count: 1, hint: '' });
            }
            
            let pathRow = recordsByPath.get(record.path);
            if (pathRow) {
                pathRow.time += record.duration;
                pathRow.count++;
            } else {
               recordsByPath.set(record.path, { time: record.duration, count: 1, hint: '' });
            }

            totalTime += record.duration;
            totalCount++;
        });

        result.buildTimeByCategory.push(new BuildTimeRow(`Updating Assets`, totalTime, totalCount, ""));

        recordsByType.forEach((value: { time: number, count: number, hint: string }, key: string) => {
            result.assetUpdateTimeByType.push(new BuildTimeRow(`Updating ${key}`, value.time, value.count, value.hint));
        });

        recordsByPath.forEach((value: { time: number, count: number, hint: string }, key: string) => {
            result.assetUpdateTime.push(new BuildTimeRow(key, value.time, value.count, value.hint));
        });
    }    
}