import { injectable, inject } from "tsyringe";
import { ISongManager } from "./ISongManager";
import { ISong } from "./ISong";
import { MMMConfigurationDatabase } from "../configuration/indexDb/MMMConfigurationDatabase";

@injectable()
export class SongManager implements ISongManager {
    private currentSong: ISong;
    songSwitched: (song: ISong) => void;
    constructor(private db: MMMConfigurationDatabase) {

    }
    async addSong(song: ISong): Promise<void> {
        await this.db.song.add(song);
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
}