import BuildTimeRow from './BuildTimeRow';
import BuildSizeByCategoryRow from './AssetByCategoryRow';
import AssetBundleSizeRow from './AssetBundleSizeRow';
import AssetBundlePathRow from './AssetBundlePathRow';
import SummaryInfo from './SummaryInfo';

export default class AnalyticResult {
    public buildTimeByCategory: BuildTimeRow[] = [];
    public assetUpdateTimeByType: BuildTimeRow[] = [];
    public assetUpdateTime: BuildTimeRow[] = [];
    public compileScriptsTime: BuildTimeRow[] = [];
    public buildSizeByCategory: BuildSizeByCategoryRow[] = [];
    public assetBundleSize: AssetBundleSizeRow[] = [];
    public assetBundlePath: AssetBundlePathRow[] = [];
    public summaryInfo: SummaryInfo = new SummaryInfo();
}