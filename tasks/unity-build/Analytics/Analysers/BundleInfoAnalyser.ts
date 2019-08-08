import Analyser from './Analyser';
import DataContext from '../DataContext';
import AnalyticResult from '../AnalyticResult';
import BundleInfoCounter from '../Counters/BundleInfoCounter';
import AssetBundleSizeRow from '../AssetBundleSizeRow';
import BundleInfo from '../BundleInfo';
import BuildSizeByCategoryRow from '../AssetByCategoryRow';

export default class BundleInfoAnalyser implements Analyser {
    public analyse(context: DataContext, result: AnalyticResult): void {
        let counter: BundleInfoCounter = context.getCounter(BundleInfoCounter);
        let records: BundleInfo[] = counter.getRecords();

        let recordsBundleSize = new Map<string, {
            compressed: number,
            uncompressed: number
        }>();

        let recordsBundleCategory = new Map<string, {
            size: number,
            percent: number
        }>();

        let assetsCount: number = 0;

        records.forEach(bundle => {
            let bundleName = recordsBundleSize.get(bundle.name);
            if (!bundleName) {
                recordsBundleSize.set(bundle.name, {
                    compressed: bundle.size,
                    uncompressed: bundle.category.find(b => b.name === 'Complete size').size
                });
            }

            if (bundle.name === 'App Built-in Resource') {
                bundle.category.forEach(category => {
                    let bundleCategoryName = recordsBundleCategory.get(category.name);
                    if (!bundleCategoryName) {
                        recordsBundleCategory.set(category.name, {
                            size: category.size,
                            percent: category.percent
                        });
                    }
                });
            }
            
            bundle.assets.forEach(asset => {
                result.assetBundlePath.push({
                    name: bundle.name,
                    path: asset.path,
                    size: asset.size
                });
            });

            assetsCount += bundle.assets.length;
        });

        recordsBundleCategory.forEach((value: { size: number, percent: number }, key: string) => {
            result.buildSizeByCategory.push(new BuildSizeByCategoryRow(key, value.size, value.percent));
        });

        recordsBundleSize.forEach((value: { compressed: number, uncompressed: number }, key: string) => {
            result.assetBundleSize.push(new AssetBundleSizeRow(key, value.compressed, value.uncompressed));
        });

        result.summaryInfo.bundleCount += records.length;
        result.summaryInfo.assetsCount += assetsCount;
    }
}