import { SongMetadata } from "../music/SongMetadata";
import { IFormBuilder } from "../render/IFormBuilder";
import { IPluginComponent } from "./IPluginComponent";

/**
 * Plugins can add additional form entries when a user adds a new song.
 * Use this component to gather additional data needed in order to run your plugin properly.
 */
export interface INewSongFormComponent extends IPluginComponent {
    addForm(formBuilder: IFormBuilder): void;
    saveSong(formData: any, metadata: SongMetadata): boolean;
}