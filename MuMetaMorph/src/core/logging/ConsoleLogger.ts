import { Injectable } from "container-ioc";
import { ILogger } from "./ILogger";

@Injectable()
export class ConsoleLogger implements ILogger {
    log(logItem: any): void {
        console.log(logItem);
    }
    logDebug(logItem: any): void {
        console.debug(logItem);
    }
    logWarn(logItem: any): void {
        console.warn(logItem);
    }
}