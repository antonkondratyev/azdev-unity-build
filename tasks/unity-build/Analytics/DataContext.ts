import Counter from './Counters/Counter';
import UnityVersion from '../UnityVersion';

export default class DataContext {
    public counters: Counter[] = [];
    public unityVersion: UnityVersion = null;

    public getCounter<T>(counterType: { new (): T }): T {
        return <any>this.counters.find(counter => counter.constructor.name === counterType.name);
    }
}