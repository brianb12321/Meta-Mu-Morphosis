import { injectable } from "tsyringe";
import { INewSongFormComponent } from "../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../core/pluginSystem/PluginBase";
import { IFormBuilder } from "../core/render/IFormBuilder";
import { HtmlWidget } from "../views/widgets/HtmlWidget";
import { SongMetadata } from "../core/music/SongMetadata";
import { IMusicDetailsPanel } from "../core/pluginSystem/IMusicDetailsPanel";
import { ISong } from "../core/music/ISong";
import { IEditSongFormComponent } from "../core/pluginSystem/IEditSongFormComponent";

@injectable()
export class TestPlugin extends PluginBase implements INewSongFormComponent, IMusicDetailsPanel, IEditSongFormComponent {
    private _name: string;
    private _friendlyName: string;
    private _description: string;
    public get panelName(): string {
        return this._friendlyName;
    }
    public get panelId(): string {
        return this._name;
    }
    get pluginName(): string {
        return this._name;
    }
    get friendlyPluginName(): string {
        return this._friendlyName;
    }

    get useNewSongForm(): boolean {
        return true;
    }
    get description(): string {
        return this._description;
    }
    get useMusicDetailsPanels(): boolean {
        return true;
    }
    song: ISong;

    basePlugin: PluginBase = this;
    constructor(name: string, friendlyName = "Test Plugin", description = "Does very testy things") {
        super();
        this._name = name;
        this._friendlyName = friendlyName;
        this._description = description;
    }
    getNewSongFormComponent(): INewSongFormComponent {
        return this;
    }
    getMusicDetailPanels(): IMusicDetailsPanel[] {
        return [this];
    }
    getEditSongFormComponent(): IEditSongFormComponent {
        return this;
    }
    addForm(formBuilder: IFormBuilder): void {
        formBuilder.addParagraph("Please enter additional data you wish to save.");
        formBuilder.addTextInput("Additional Data", "additionalDataId", false);
    }
    addEditSongForm(formBuilder: IFormBuilder, metadata: SongMetadata) {
        formBuilder.addParagraph("Please enter additional data you wish to save.");
        formBuilder.addTextInput("Additional Data", "additionalDataId", false, input => input.value = metadata.value["additionalData"]);
    }
    saveSong(formData: any, metadata: SongMetadata): boolean {
        let additionalData = formData["additionalDataId"];
        if (additionalData !== "") {
            metadata.value["additionalData"] = additionalData;
        }
        return true;
    }
    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        content.createElement("p", p => p.textContent = metadata.value.additionalData);
    }
}