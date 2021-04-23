import { inject, injectAll, injectable } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TSongManager, TPlugins } from "../../globalSymbols";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { SongProeprtiesPanel } from "../defaultPanels/SongPropertiesPanel";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { SongMetadata } from "../../core/music/SongMetadata";

@injectable()
export class MusicDetailsViewModel extends BaseViewModel {
    private song: ISong;
    public loadedPluginPanels: IMusicDetailsPanel[];
    public loadedPluginNames: string[];
    public songPropertiesPanel: IMusicDetailsPanel;
    public songEdited: Function;
    public get songId(): number {
        return this.song.songId;
    }
    constructor(@inject(TSongManager) public songManager: ISongManager, @injectAll(TPlugins) public plugins: PluginBase[]) {
        super();
    }
    async setSongId(value: number) {
        this.song = await this.songManager.getSongById(value);
        //Load panels.
        this.loadedPluginPanels = [];
        this.loadedPluginNames = [];
        for (let plugin of this.plugins.filter(filterPlugin => this.song.pluginsUsed.includes(filterPlugin.pluginName))) {
            this.loadedPluginNames.push(plugin.pluginName);
            if (plugin.useMusicDetailsPanels) {
                for (let panel of plugin.getMusicDetailPanels()) {
                    panel.song = this.song;
                    this.loadedPluginPanels.push(panel);
                }
            }
        }
        //Load the song-properties panel.
        this.songPropertiesPanel = new SongProeprtiesPanel(this);
        this.songPropertiesPanel.song = this.song;
    }
    async updateSong(pluginsAdded: INewSongFormComponent[], updateFormData: any): Promise<void> {
        this.song.name = updateFormData.main.songName as string;
        this.song.audioStreamUrl = updateFormData.main.audioStreamUrl as string;
        this.song.bannerImageUrl = updateFormData.main.songImageUrl;
        for (let newPlugin of pluginsAdded.map(pluginComponent => pluginComponent.basePlugin.pluginName)) {
            this.song.pluginsUsed.push(newPlugin);
        }
        //We are now going to let the plugins write to their respective metadata.
        for (let component of pluginsAdded) {
            let metadata = new SongMetadata(component.basePlugin);
            if (!component.saveSong(updateFormData[component.basePlugin.pluginName], metadata)) {
                throw Error(`${component.basePlugin.pluginName} failed to add metadata to the database. Aborting...`);
            }
            this.song.additionalMetadata.push(metadata);
        }
        await this.songManager.putSong(this.songId, this.song);
        this.songEdited();
    }
    public getSongMetadataForPlugin(pluginName: string) {
        return this.song.additionalMetadata.find(metadata => metadata.pluginName === pluginName);
    }
    public get songName(): string {
        return this.song.name;
    }
    public get songBannerImageUrl(): string {
        return this.song.bannerImageUrl;
    }

    async switchSong(): Promise<void> {
        await this.songManager.switchSong(this.song.songId);
    }
    async deleteSong(): Promise<void> {
        await this.songManager.deleteSongById(this.songId);
    }
    async getSongJson(): Promise<string> {
        return await this.songManager.songToJson(this.song.songId);
    }
}