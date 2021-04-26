import { injectable, inject, injectAll } from "tsyringe";
import { ISongManager } from "../../core/music/ISongManager";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TPlugins, TSongManager } from "../../globalSymbols";
import { ISong } from "../../core/music/ISong";

@injectable()
export class HomeViewModel extends BaseViewModel {
    constructor(@inject(TSongManager) private songManager: ISongManager, @injectAll(TPlugins) private plugins: PluginBase[]) {
        super();
    }
    async getNumberOfSongs(): Promise<number> {
        let songs = await this.songManager.getSongs();
        return songs.length;
    }
    async getSongs(): Promise<ISong[]> {
        return await this.songManager.getSongs();
    }
    async switchSong(songId: number) {
        await this.songManager.switchSong(songId);
    }
    getNumberOfPlugins(): number {
        return this.plugins.length;
    }
}