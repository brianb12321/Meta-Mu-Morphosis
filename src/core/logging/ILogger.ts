export interface ILogger {
    log(logItem: any): void;
    logDebug(logItem: any): void;
    logWarn(logItem: any): void;
}