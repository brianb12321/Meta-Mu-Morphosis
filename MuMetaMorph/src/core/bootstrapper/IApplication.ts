import { ServiceExtensions } from "../../serviceExtensions";
import { ILogger } from "../logging/ILogger";
import { BaseViewModel } from "../render/BaseViewModel";

export interface IApplication {
    run(indexPageToken: any): Promise<void>;
    configureContainer(containerBuilder: (serviceExtensions: ServiceExtensions) => void): IApplication;
    addConfigurationManager(configBuilder: Function): IApplication;
    addLogger(logger: ILogger): IApplication;
}