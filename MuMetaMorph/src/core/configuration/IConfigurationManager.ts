import { IConfiguration } from "./IConfiguration";

export interface IConfigurationManager {
    getConfiguration<TConfObj extends IConfiguration>(name: string): Promise<TConfObj>;
    saveConfiguration<TConfObj extends IConfiguration>(name: string, configObj: TConfObj): Promise<void>;
    configurationExists(name: string): Promise<boolean>;
}