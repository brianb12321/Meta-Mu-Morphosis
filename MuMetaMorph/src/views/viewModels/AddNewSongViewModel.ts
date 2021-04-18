import { inject, injectable } from "tsyringe";
import { ISongManager } from "../../core/music/ISongManager";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TSongManager } from "../../globalSymbols";

@injectable()
export class AddNewSongViewModel extends BaseViewModel {
    songName: string;
    artist: string;
    audioStreamUrl: string;
    dateReleased: Date;
    constructor(@inject(TSongManager) public songManager: ISongManager) {
        super();
    }
    async addSongAndClear(): Promise<void> {
        await this.songManager.addSong({
            name: this.songName,
            dateReleased: this.dateReleased,
            audioStreamUrl: this.audioStreamUrl
        });
    }
}