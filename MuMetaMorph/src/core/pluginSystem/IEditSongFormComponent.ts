import { SongMetadata } from "../music/SongMetadata";
import { IFormBuilder } from "../render/IFormBuilder";
import { IPluginComponent } from "./IPluginComponent";

/**
 * Plugins can add a tab item to the song-properties panel. Use this component for advance song property settings or facilitating editing sopng properties.
 */
export interface IEditSongFormComponent extends IPluginComponent {
    addEditSongForm(formBuilder: IFormBuilder, metadata: SongMetadata): void;
    saveSong(formData: any, metadata: SongMetadata): boolean;
}