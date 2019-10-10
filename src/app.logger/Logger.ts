// const log4js = require('log4js');
import log4js from 'log4js';

export default class Logger {
    private static _LogWriter: log4js.Logger;
    protected static get LogWriter(): log4js.Logger {
        if(this._LogWriter === undefined ||
            this._LogWriter === null) {
            // 設定ファイル（log-config.json）の読み込み
            log4js.configure('log-config.json');
            this._LogWriter = log4js.getLogger('system');
        }
        return this._LogWriter;
    }
    public static Test() {
        const writer = Logger.LogWriter;
        writer.debug(`hello log4!`);
    }

    public static Fatal(msg: string) {
        this._LogWriter.fatal(msg);
    }
    public static Error(msg: string) {
        this._LogWriter.error(msg);
    }
    public static Warn(msg: string) {
        this._LogWriter.warn(msg);
    }
    public static Debug(msg: string) {
        this._LogWriter.debug(msg);
    }
    public static Info(msg: string) {
        this._LogWriter.info(msg);
    }
}