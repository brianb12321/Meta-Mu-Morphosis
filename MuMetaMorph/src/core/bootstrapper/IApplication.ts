import { ServiceExtensions } from "../../serviceExtensions";
import { ILogger } from "../logging/ILogger";
import { BaseViewModel } from "../render/BaseViewModel";

export interface IApplication {
    run(indexPageToken: any): Promise<void>;
    configureContainer(containerBuilder: (serviceExtensions: ServiceExtensions) => void): IApplication;
    useDatabase(databaseBuilder: Function): IApplication;
    addConfigurationManager(configBuilder: Function): IApplication;
    addSongManager(songManagerBuilder: Function): IApplication;
    addResourceManager(resourceManagerBuilder: Function): IApplication;
    addLogger(logger: ILogger): IApplication;
}