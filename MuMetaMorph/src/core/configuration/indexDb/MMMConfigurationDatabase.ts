import Dexie from "dexie";
import { ILogger } from "../../logging/ILogger";
import { ISong } from "../../music/ISong";
import { ConfigurationObject } from "../ConfigurationObject";
import { Resource } from "../../resourceSystem/Resource";
import { IApplication } from "../../bootstrapper/IApplication";

export class MMMConfigurationDatabase extends Dexie {
    configuration: Dexie.Table<ConfigurationObject, number>;
    song: Dexie.Table<ISong, number>;
    resource: Dexie.Table<Resource, number>;
    constructor(private logger: ILogger, application: IApplication) {
        super("MMConfigurationDatabase");
        this.logger.log("Configuring the database...");
        this.version(application.MajorVersion).stores({
            configuration: "++Id, &Name, Value",
            song: "++songId, name, listImageUrl, bannerImageUrl, dateReleased, audioStreamUrl, additionalMetadata",
            resource: "++resourceId, resourceName, resourceType, resourceBody"
        });
    }
}