import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import CodeStrippingTimeCounter from '../Counters/CodeStrippingTimeCounter';
import BuildTimeRow from '../BuildTimeRow';

export default class CodeStrippingAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter = context.getCounter(CodeStrippingTimeCounter);
        let records = counter.getRecords();
        
        let time: number = 0;
        let count: number = 0;
        let hint: string = '';
        
        records.forEach(record => {
            time += record.duration;
            count++;
        });
        
        result.buildTimeByCategory.push(new BuildTimeRow('Code Stripping', time, count, hint));
    }
}