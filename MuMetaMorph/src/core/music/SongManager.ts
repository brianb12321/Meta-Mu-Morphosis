import { injectable } from "tsyringe";
import { ISongManager } from "./ISongManager";
import { ISong } from "./ISong";
import { MMMConfigurationDatabase } from "../configuration/indexDb/MMMConfigurationDatabase";

@injectable()
export class SongManager implements ISongManager {

    private currentSong: ISong;
    songSwitched: (song: ISong) => void;
    constructor(private db: MMMConfigurationDatabase) {

    }
    async addSong(song: ISong): Promise<ISong> {
        let newSongId = await this.db.song.add(song);
        return await this.db.song.get(newSongId);
    }
    async switchSong(songId: number): Promise<void> {
        this.currentSong = await this.db.song.get(songId);
        if (this.songSwitched != null)
            await this.songSwitched(this.currentSong);
    }
    async getSongs(): Promise<ISong[]> {
        return await this.db.song.toArray();
    }
    async getSongById(songId: number): Promise<ISong> {
        return await this.db.song.get(songId);
    }
    async deleteSongById(songId: number): Promise<void> {
        await this.db.song.delete(songId);
    }

    async putSong(songId: number, newSong: ISong): Promise<void> {
        await this.db.song.put(newSong, songId);
    }
    async songToJson(songId: number): Promise<string> {
        let song = await this.getSongById(songId);
        return JSON.stringify(song);
    }
    async jsonToSong(jsonText: string): Promise<ISong> {
        let jsonObject = JSON.parse(jsonText);
        let song: ISong = {
            name: jsonObject.name,
            dateAdded: new Date(Date.now()),
            bannerImageUrl: jsonObject.bannerImageUrl,
            audioStreamUrl: jsonObject.audStreamUrl,
            pluginsUsed: jsonObject.pluginsUsed,
            additionalMetadata: jsonObject.additionalMetadata
        };
        return await this.addSong(song);
    }
}