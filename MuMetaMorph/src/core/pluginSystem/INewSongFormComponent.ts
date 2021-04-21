///Plugins can add additional form entries when a user adds a new song.
///Use this component to gather additional data needed in order to run your plugin properly.

import { SongMetadata } from "../music/SongMetadata";
import { IFormBuilder } from "../render/IFormBuilder";
import { PluginBase } from "./PluginBase";

export interface INewSongFormComponent {
    basePlugin: PluginBase;
    addForm(formBuilder: IFormBuilder): void;
    saveSong(formData: any, metadata: SongMetadata): boolean;
}