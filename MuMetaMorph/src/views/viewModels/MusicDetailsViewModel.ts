import { inject, injectAll, injectable } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TSongManager, TPlugins } from "../../globalSymbols";
import { PluginBase } from "../../core/pluginSystem/PluginBase";

@injectable()
export class MusicDetailsViewModel extends BaseViewModel {
    private song: ISong;
    public loadedPluginPanels: IMusicDetailsPanel[];
    public get songId(): number {
        return this.song.songId;
    }
    constructor(@inject(TSongManager) public songManager: ISongManager, @injectAll(TPlugins) private plugins: PluginBase[]) {
        super();
    }
    async setSongId(value: number) {
        this.song = await this.songManager.getSongById(value);
        //Load panels.
        this.loadedPluginPanels = [];
        //Probably inefficient
        for (let plugin of this.plugins.filter(plugin => this.song.pluginsUsed.find(pluginName => plugin.pluginName === pluginName) != null)) {
            if (plugin.useMusicDetailsPanels) {
                for (let panel of plugin.getMusicDetailPanels()) {
                    this.loadedPluginPanels.push(panel);
                }
            }
        }
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
}