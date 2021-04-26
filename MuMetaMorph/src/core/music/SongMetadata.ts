import { PluginBase } from "../pluginSystem/PluginBase";
import { ISong } from "./ISong";
import { ISongInformation } from "./ISongInformation";

//Additional song data that can be stored in the database.
export class SongMetadata {
    metadataId?: number;
    songId?: number;
    pluginName: string;
    value: any;
    constructor(plugin: PluginBase) {
        this.pluginName = plugin.pluginName;
        this.value = {};
    }
    toObject<TObject extends ISongInformation>(): TObject {
        return this.value as TObject;
    }
}