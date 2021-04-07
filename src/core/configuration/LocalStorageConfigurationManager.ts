import { ILogger } from "../logging/ILogger";
import { IConfigurationManager } from "./IConfigurationManager";

export class LocalStorageConfigurationManager implements IConfigurationManager {
    constructor(private logger: ILogger) {

    }
    async saveRootConfigObject(rootName: string, rootConfigObject: any): Promise<void> {
        //For debugging
        let configObjectJson = JSON.stringify(rootConfigObject);
        this.logger.logDebug(`[Configuration Manager]: Saving '${rootName}' as JSON: ${configObjectJson}`);
        localStorage.setItem(rootName, configObjectJson);
    }
    async loadRootConfigObject(rootName: string): Promise<any> {
        //For debugging
        let configObjectJson = localStorage.getItem(rootName);
        this.logger.logDebug(`[Configuration Manager]: Loading '${rootName}' as JSON: ${configObjectJson}`);
        let configObject = JSON.parse(configObjectJson);
        return configObject;
    }
    async rootExists(rootName: string): Promise<boolean> {
        //Check if there is a value stored for the given root name.
        if (localStorage.getItem(rootName)) {
            this.logger.log(`[Configuration Manager]: '${rootName}' config root exists.`);
            return true;
        }
        this.logger.logWarn(`[Configuration Manager]: '${rootName}' config root does not exist.`);
        return false;
    }
}