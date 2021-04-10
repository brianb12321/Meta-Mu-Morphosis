import Dexie from "dexie";
import { ILogger } from "../../logging/ILogger";
import { ConfigurationObject } from "../ConfigurationObject";

export class MMMConfigurationDatabase extends Dexie {
    Configuration: Dexie.Table<ConfigurationObject, number>;
    constructor(private logger: ILogger) {
        super("MMConfigurationDatabase");
        this.logger.log("Configuring the database...");
        this.version(1).stores({
            Configuration: "++Id, &Name, Value"
        });
    }
}