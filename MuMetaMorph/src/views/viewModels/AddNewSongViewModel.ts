import { inject, injectable, injectAll } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { SongMetadata } from "../../core/music/SongMetadata";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { IResourceManager } from "../../core/resourceSystem/IResourceManager";
import { TPlugins, TResourceManager, TSongManager } from "../../globalSymbols";
import { AccordionSection } from "../widgets/AccordionWidget";

@injectable()
export class AddNewSongViewModel extends BaseViewModel {
    formData: any;
    supportedPluginComponents: INewSongFormComponent[];
    pluginsUsed: INewSongFormComponent[];
    accordionSections: AccordionSection[];
    constructor(@inject(TSongManager) public songManager: ISongManager, @injectAll(TPlugins) plugins: PluginBase[], @inject(TResourceManager) public resourceManager: IResourceManager) {
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
    async importSongAndClear(jsonText: string): Promise<number> {
        let song = await this.songManager.jsonToSong(jsonText);
        return song.songId;
    }
    async addSongAndClear(): Promise<number> {
        let song: ISong = {
            name: this.formData.main.songName as string,
            artist: this.formData.main.artist as string,
            dateAdded: new Date(Date.now()),
            audioStreamResourceId: this.formData.main.audioResourceId as number,
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