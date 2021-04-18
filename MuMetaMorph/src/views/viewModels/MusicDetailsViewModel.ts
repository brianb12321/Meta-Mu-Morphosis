import { inject, injectable } from "tsyringe";
import { ISong } from "../../core/music/ISong";
import { ISongManager } from "../../core/music/ISongManager";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TSongManager } from "../../globalSymbols";

@injectable()
export class MusicDetailsViewModel extends BaseViewModel {
    private song: ISong;
    public get songId(): number {
        return this.song.songId;
    }
    async setSongId(value: number) {
        this.song = await this.songManager.getSongById(value);
    }
    public get songName(): string {
        return this.song.name;
    }
    constructor(@inject(TSongManager) public songManager: ISongManager) {
        super();
    }
    async switchSong(): Promise<void> {
        await this.songManager.switchSong(this.song.songId);
    }
}