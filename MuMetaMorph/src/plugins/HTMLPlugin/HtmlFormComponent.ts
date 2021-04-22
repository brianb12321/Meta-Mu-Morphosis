import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { IFormBuilder } from "../../core/render/IFormBuilder";
import { SongMetadata } from "../../core/music/SongMetadata";

export class HtmlFormComponent implements INewSongFormComponent {
    constructor(public basePlugin: PluginBase) {

    }
    addForm(formBuilder: IFormBuilder): void {
        formBuilder.addTextarea("HTML Code:", "htmlInput", true);
    }
    saveSong(formData: any, metadata: SongMetadata): boolean {
        metadata.value["html"] = formData.htmlInput;
        return true;
    }
}