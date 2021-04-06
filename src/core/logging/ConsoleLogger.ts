import { Injectable } from "container-ioc";
import { ILogger } from "./ILogger";

@Injectable()
export class ConsoleLogger implements ILogger {
    log(logItem: any): void {
        console.log(logItem);
    }
}