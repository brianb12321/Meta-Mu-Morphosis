import { Inject, Injectable } from "container-ioc";
import { TLogger } from "../../globalSymbols";
import { ILogger } from "../../logging/ILogger";
import { ConfigurationObject } from "../ConfigurationObject";
import { IConfiguration } from "../IConfiguration";
import { IConfigurationManager } from "../IConfigurationManager";
import { MMMConfigurationDatabase } from "./MMMConfigurationDatabase";

@Injectable()
export class IndexDbConfigurationManager implements IConfigurationManager {
    private database: MMMConfigurationDatabase;
    constructor(@Inject(TLogger) private logger: ILogger) {
        this.database = new MMMConfigurationDatabase(logger);
    }
    async getConfiguration<TConfObj extends IConfiguration>(name: string): Promise<TConfObj> {
        this.logger.log(`[Configuration Manager]: Getting configuration object for ${name}`);
        this.database.Configuration.mapToClass(ConfigurationObject);
        let configObj = await this.database.Configuration.where("Name").equalsIgnoreCase(name).first();
        return configObj.toObject<TConfObj>();
    }
    async saveConfiguration<TConfObj extends IConfiguration>(name: string, configObj: TConfObj): Promise<void> {
        this.logger.log(`[Configuration Manager]: Saving configuration object for ${name}`);
        let configObject = new ConfigurationObject();
        configObject.Name = name;
        configObject.Value = configObj;
        this.database.Configuration.put(configObject);
    }
    async configurationExists(name: string): Promise<boolean> {
        this.logger.log(`[Configuration Manager]: Checking if configuration object exists for ${name}`);
        if (await this.database.Configuration.where("Name").equalsIgnoreCase(name).count() >= 1) {
            this.logger.log(`[Configuration Manager]: Config object "${name}" exist.`);
            return true;
        }
        else {
            this.logger.logWarn(`[Configuration Manager]: Config object "${name}" does not exist.`);
            return false;
        }
    }
}