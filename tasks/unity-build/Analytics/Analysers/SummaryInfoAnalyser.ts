import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import UnityVersion from '../../UnityVersion';

export default class SummaryInfoAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult) {
        result.summaryInfo.unityVersion = context.unityVersion.editorVersion;
    }
}