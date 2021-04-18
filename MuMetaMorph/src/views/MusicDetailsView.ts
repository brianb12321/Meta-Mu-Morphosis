import { View } from "../core/render/View";
import { getMusicDetailsViewModel } from "../viewModelCollection";
import { MusicDetailsViewModel } from "./viewModels/MusicDetailsViewModel";

export class MusicDetailsView extends View<MusicDetailsViewModel> {
    constructor(songId: number) {
        super();
        this.dataContext = getMusicDetailsViewModel();
        this.renderBody = document.createElement("main");
        this.dataContext.setSongId(songId).then(() => {
            let heading = document.createElement("h1");
            heading.textContent = this.dataContext.songName;
            this.renderBody.appendChild(heading);
            let button = document.createElement("button");
            button.textContent = "Switch Audio";
            button.addEventListener("click", () => {
                this.dataContext.switchSong();
            });
            this.renderBody.appendChild(button);
        });
    }
    shouldRender(): boolean {
        return true;
    }
}