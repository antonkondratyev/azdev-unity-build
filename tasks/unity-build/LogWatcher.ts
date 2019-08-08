import * as os from 'os';
import * as fs from 'fs';
import * as tl from 'vsts-task-lib/task';
import * as events from 'events';
import * as chokidar from 'chokidar';

export default class LogWatcher extends events.EventEmitter {
    private _watcher: chokidar.FSWatcher = new chokidar.FSWatcher();
    private _watchedLines: number = 0;
    private _lastSize: number = 0;
    private _logsReadBuffer: string = '';

    constructor(filePath?: string) {
        super();

        if (filePath) this.watchFile(filePath);
    }

    /**
     * Adding a file for watching.
     * @param filePath File to watching.
     * @param message Message when the watching is started.
     */
    public watchFile(filePath: string, message?: string): void {
        this._watcher.add(filePath);

        if (message) console.log(message);

        this._watcher.on('change', (filePath: string, stats: any) => {
            if (stats) {
                let input: fs.ReadStream = fs.createReadStream(filePath, {
                    encoding: 'utf-8',
                    start: this._lastSize,
                    end: stats.size
                });
                this._lastSize = stats.size;

                input.on('error', (err: any) => {
                    err.code == 'ENOENT'
                        ? console.error(tl.loc('FileNotFound', filePath))
                        : console.error(err);
                });

                input.on('data', (data: string) => {
                    this._logsReadBuffer += data;
                });

                input.on('end', () => {
                    let lines: string[] = this._logsReadBuffer.split(os.EOL);
                    this._logsReadBuffer = lines.pop();

                    lines.forEach(line => {
                        this._watchedLines++;
                        this.emit('line', line);
                    });

                    input.destroy();
                });
            }
        });
    }

    public watchFileBuffer(filePath: string, message?: string): void {
        this._watcher.add(filePath);

        if (message) console.log(message);

        this._watcher.on('change', (filePath: string, stats: any) => {
            if (stats) {
                let length: number = stats.size - this._lastSize;
                let buffer: Buffer = new Buffer(length);
                let fd: number = fs.openSync(filePath, 'r');

                fs.read(fd, buffer, 0, length, this._lastSize, err => {
                    if (err) return;

                    let lines: string[] = buffer.toString('utf-8').split(os.EOL);
                    lines.forEach(line => {
                        this._watchedLines++;
                        this.emit('line', line);
                    });

                    fs.closeSync(fd);
                });

                this._lastSize = stats.size;
            }
        });
    }

    public watchLines(stdout: string): void {
        this._logsReadBuffer += stdout;
        let lines: string[] = this._logsReadBuffer.split(os.EOL);
        this._logsReadBuffer = lines.pop();

        lines.forEach(line => {
            this._watchedLines++;
            this.emit('line', line);
        });
    }

    /**
     * Stop watching file.
     * @param message Message when the watching is closed.
     */
    public close(message?: string): void {
        this._watcher.close();
        
        if (message) console.log(message);
    }

    /**
     * Count of received lines by the watcher.
     */
    get linesCount(): number {
        return this._watchedLines;
    }
}