import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { IFormBuilder } from "../../core/render/IFormBuilder";
import { SongMetadata } from "../../core/music/SongMetadata";
import { IEditSongFormComponent } from "../../core/pluginSystem/IEditSongFormComponent";

export class HtmlFormComponent implements INewSongFormComponent, IEditSongFormComponent {
    constructor(public basePlugin: PluginBase) {

    }
    addForm(formBuilder: IFormBuilder): void {
        formBuilder.addTextarea("HTML Code:", "htmlInput", true);
    }
    addEditSongForm(formBuilder: IFormBuilder, metadata: SongMetadata): void {
        formBuilder.addTextarea("HTML Code:", "htmlInput", true, input => input.value = metadata.value["html"]);
    }
    saveSong(formData: any, metadata: SongMetadata): boolean {
        metadata.value["html"] = formData.htmlInput;
        return true;
    }
}