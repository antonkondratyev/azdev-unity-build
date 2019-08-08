import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import CompileScriptsTimeCounter from '../Counters/CompileScriptsTimeCounter';
import BuildTimeRow from '../BuildTimeRow';

export default class CompileScriptsAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(CompileScriptsTimeCounter);
        let records = counter.getRecords();
        let totalTime: number = 0;
        let totalCount: number = 0;
        
        let recordsByPath = new Map<string, { time: number, count: number, hint: string }>();
        records.forEach(record => {
            let row = recordsByPath.get(record.fileName);
            if (row) {
                row.time += record.duration;
                row.count++;
            } else {
               recordsByPath.set(record.fileName, { time: record.duration, count: 1, hint: '' });
            }
            
            totalTime += record.duration;
            totalCount++;
        });

        result.buildTimeByCategory.push(new BuildTimeRow('Compile Scripts', totalTime, totalCount, ""));

        recordsByPath.forEach((value: { time: number, count: number, hint: string }, key: string) => {
            result.compileScriptsTime.push(new BuildTimeRow(key, value.time, value.count, value.hint));
        });
    }
}