import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';

export default interface Analyser {
    analyse(context: DataContext, result: AnalyticResult): void;
}