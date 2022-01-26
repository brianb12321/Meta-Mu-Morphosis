import { ServiceExtensions } from "../../serviceExtensions";
import { ILogger } from "../logging/ILogger";
import { BaseViewModel } from "../render/BaseViewModel";

export interface IApplication {
    /**The major component of the version number (X.0.0). Increment this number when a database upgrade is required. */
    MajorVersion: number,
    /**Any features or bug fixes that are not a build. */
    MinorVersion: number;
    run(indexPageToken: any): Promise<void>;
    configureContainer(containerBuilder: (serviceExtensions: ServiceExtensions) => void): IApplication;
    useDatabase(databaseBuilder: Function): IApplication;
    addConfigurationManager(configBuilder: Function): IApplication;
    addSongManager(songManagerBuilder: Function): IApplication;
    addResourceManager(resourceManagerBuilder: Function): IApplication;
    addLogger(logger: ILogger): IApplication;
}