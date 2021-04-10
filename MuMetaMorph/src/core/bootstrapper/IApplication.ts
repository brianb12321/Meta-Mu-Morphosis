import { IConfigurationManager } from "../configuration/IConfigurationManager";
import { ILogger } from "../logging/ILogger";

export interface IApplication {
    run(indexPageToken: any): Promise<void>;
    configureContainer(containerBuilder: Function): IApplication;
    addConfigurationManager(configBuilder: Function): IApplication;
    addLogger(logger: ILogger): IApplication;
}