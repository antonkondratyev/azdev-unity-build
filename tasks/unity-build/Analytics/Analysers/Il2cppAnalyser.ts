import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import Il2cppTimeCounter from '../Counters/Il2cppTimeCounter';
import BuildTimeRow from '../BuildTimeRow';

export default class Il2cppAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(Il2cppTimeCounter);
        let records = counter.getRecords();
        
        let time: number = 0;
        let count: number = 0;
        let hint: string = '';
        
        records.forEach(record => {
            time += record.duration;
            count++;
        });
        
        result.buildTimeByCategory.push(new BuildTimeRow('IL2CPP Processings', time, count, hint));
    }
}