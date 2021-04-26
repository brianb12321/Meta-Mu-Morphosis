import { inject, injectAll, injectable } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TSongManager, TPlugins, TResourceManager } from "../../globalSymbols";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { SongProeprtiesPanel } from "../defaultPanels/SongPropertiesPanel";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { SongMetadata } from "../../core/music/SongMetadata";
import { IEditSongFormComponent } from "../../core/pluginSystem/IEditSongFormComponent";
import { IResourceManager } from "../../core/resourceSystem/IResourceManager";
import { Resource, ResourceType } from "../../core/resourceSystem/Resource";
import { HomePanel } from "../defaultPanels/HomePanel";

@injectable()
export class MusicDetailsViewModel extends BaseViewModel {
    private song: ISong;
    public loadedPluginPanels: IMusicDetailsPanel[];
    public loadedPlugins: PluginBase[];
    public songPropertiesPanel: IMusicDetailsPanel;
    public homePanel: IMusicDetailsPanel;
    public songEdited: Function;
    public refreshSong: Function;
    public noAudioPresent: boolean;
    private audioResource: Resource;
    public get songId(): number {
        return this.song.songId;
    }
    constructor(@inject(TSongManager) public songManager: ISongManager, @injectAll(TPlugins) public plugins: PluginBase[], @inject(TResourceManager) public resourceManager: IResourceManager) {
        super();
    }
    async setSongId(value: number) {
        this.song = await this.songManager.getSongById(value);
        try {
            this.audioResource = await this.resourceManager.getResource(this.song.audioStreamResourceId);
        } catch (error) {
            this.noAudioPresent = true;
        }
        
        //Load panels.
        this.loadedPluginPanels = [];
        this.loadedPlugins = [];
        for (let plugin of this.plugins.filter(filterPlugin => this.song.pluginsUsed.includes(filterPlugin.pluginName))) {
            this.loadedPlugins.push(plugin);
            if (plugin.useMusicDetailsPanels) {
                for (let panel of plugin.getMusicDetailPanels()) {
                    panel.song = this.song;
                    this.loadedPluginPanels.push(panel);
                }
            }
        }
        //Load the home panel.
        this.homePanel = new HomePanel(this);
        this.homePanel.song = this.song;
        //Load the song-properties panel.
        this.songPropertiesPanel = new SongProeprtiesPanel(this);
        this.songPropertiesPanel.song = this.song;
    }
    async updateSong(pluginsAdded: INewSongFormComponent[], editComponents: IEditSongFormComponent[], updateFormData: any): Promise<void> {
        this.song.name = updateFormData.main.songName as string;
        this.song.artist = updateFormData.main.artist as string;
        this.song.audioStreamResourceId = updateFormData.main.audioResourceId as number;
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
        for (let editComponent of editComponents) {
            if (!editComponent.saveSong(updateFormData[editComponent.basePlugin.pluginName], this.getSongMetadataForPlugin(editComponent.basePlugin.pluginName))) {
                throw Error(`${editComponent.basePlugin.pluginName} failed to edit metadata to the database. Aborting...`);
            }
        }
        await this.songManager.putSong(this.songId, this.song);
        this.songEdited();
        this.refreshSong();
    }
    public async removePlugin(pluginName: string) {
        this.song.additionalMetadata.splice(this.song.pluginsUsed.indexOf(pluginName), 1);
        this.song.pluginsUsed.splice(this.song.pluginsUsed.indexOf(pluginName), 1);
        await this.songManager.putSong(this.songId, this.song);
        this.refreshSong();
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
    public audioResourceExists(): boolean {
        if (this.audioResource != null) return true;
        else return false;
    }
    public getAudioResourceType(): ResourceType {
        return this.audioResource.resourceType;
    }
    public getAudioResourceId(): number {
        return this.audioResource.resourceId;
    }
    public getAudioResourceName(): string {
        return this.audioResource.resourceName;
    }
    public getPluginByName(pluginName: string): PluginBase {
        return this.loadedPlugins.find(plugin => plugin.pluginName === pluginName);
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