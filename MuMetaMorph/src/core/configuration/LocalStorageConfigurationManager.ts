import { ILogger } from "../logging/ILogger";
import { IConfigurationManager } from "./IConfigurationManager";

export class LocalStorageConfigurationManager implements IConfigurationManager {
    private CONFIG_ROOT_PATH:string = "MMM";
    constructor(private logger: ILogger) {
        this.iterateConfigurations();
    }
    private iterateConfigurations() {
        for (let i = 0; i < localStorage.length; i++) {
            this.logger.logDebug(`[Configuration Manager]: Configuration root object found: ${localStorage.key(i)}`);
        }
    }
    async saveRootConfigObject(rootName: string, rootConfigObject: any): Promise<void> {
        //For debugging
        let configObjectJson = JSON.stringify(rootConfigObject);
        this.logger.logDebug(`[Configuration Manager]: Saving '${this.CONFIG_ROOT_PATH}/${rootName}' as JSON: ${configObjectJson}`);
        localStorage.setItem(`${this.CONFIG_ROOT_PATH}/${rootName}`, configObjectJson);
    }
    async loadRootConfigObject(rootName: string): Promise<any> {
        //For debugging
        let configObjectJson = localStorage.getItem(`${this.CONFIG_ROOT_PATH}/${rootName}`);
        this.logger.logDebug(`[Configuration Manager]: Loading '${this.CONFIG_ROOT_PATH}/${rootName}' as JSON: ${configObjectJson}`);
        let configObject = JSON.parse(configObjectJson);
        return configObject;
    }
    async rootExists(rootName: string): Promise<boolean> {
        //Check if there is a value stored for the given root name.
        if (localStorage.getItem(`${this.CONFIG_ROOT_PATH}/${rootName}`)) {
            this.logger.log(`[Configuration Manager]: '${this.CONFIG_ROOT_PATH}/${rootName}' config root exists.`);
            return true;
        }
        this.logger.logWarn(`[Configuration Manager]: '${this.CONFIG_ROOT_PATH}/${rootName}' config root does not exist.`);
        return false;
    }
}