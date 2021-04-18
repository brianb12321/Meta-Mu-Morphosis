import { ISong } from "./ISong";
import { ISongInformation } from "./ISongInformation";

//Additional song data that can be stored in the database.
export class SongMetadata {
    metadataId?: number;
    song: ISong;
    pluginName: string;
    value: any;
    toObject<TObject extends ISongInformation>(): TObject {
        return this.value as TObject;
    }
}