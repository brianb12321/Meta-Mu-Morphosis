import { inject, injectable, injectAll } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { SongMetadata } from "../../core/music/SongMetadata";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TPlugins, TSongManager } from "../../globalSymbols";
import { HtmlWidget } from "../widgets/HtmlWidget";

@injectable()
export class AddNewSongViewModel extends BaseViewModel {
    formData: any;
    supportedPluginComponents: INewSongFormComponent[];
    pluginsUsed: INewSongFormComponent[];
    accordionSections: AccordionSection[];
    constructor(@inject(TSongManager) public songManager: ISongManager, @injectAll(TPlugins) plugins: PluginBase[]) {
        super();
        this.supportedPluginComponents = [];
        this.pluginsUsed = [];
        this.formData = {};
        this.accordionSections = [];
        for (let plugin of plugins) {
            if (plugin.useNewSongForm) {
                this.supportedPluginComponents.push(plugin.getNewSongFormComponent());
            }
        }
    }
    async addSongAndClear(): Promise<number> {
        let song: ISong = {
            name: this.formData.main.songName as string,
            dateReleased: this.formData.main.dateReleased as Date,
            audioStreamUrl: this.formData.main.audioStreamUrl as string,
            bannerImageUrl: this.formData.main.songImageUrl,
            pluginsUsed: this.pluginsUsed.map(component => component.basePlugin.pluginName),
            additionalMetadata: []
        };
        //We are now going to let the plugins write to their respective metadata.
        for (let component of this.pluginsUsed) {
            let metadata = new SongMetadata(component.basePlugin);
            if (!component.saveSong(this.formData[component.basePlugin.pluginName], metadata)) {
                throw Error(`${component.basePlugin.pluginName} failed to add metadata to the database. Aborting...`);
            }
            song.additionalMetadata.push(metadata);
        }
        let newSong = await this.songManager.addSong(song);
        return newSong.songId;
    }
}

export interface AccordionSection {
    accordionSection: HtmlWidget;
    panel: HtmlWidget;
    component: INewSongFormComponent;
}