import CommonOptions from './CommonOptions';
import TraceOptions from './TraceOptions';
import LoggingOptions from './LoggingOptions';
import PackageOptions from './PackageOptions';
import CachingOptions from './CachingOptions';
import TestingOptions from './TestingOptions';
import LicenseOptions from './LicenseOptions';
import AdvancedOptions from './AdvancedOptions';

export default class TaskOptions {
    common: CommonOptions;
    trace: TraceOptions;
    logging: LoggingOptions;
    package: PackageOptions;
    caching: CachingOptions;
    testing: TestingOptions;
    license: LicenseOptions;
    advanced: AdvancedOptions;
}