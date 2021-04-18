import { Howl } from "howler";
import { View } from "../core/render/View";
import { getPlayerViewModel } from "../viewModelCollection";
import { PlayerViewModel } from "./viewModels/PlayerViewModel";
import { AudioWidget } from "./widgets/AudioWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { CustomAudioWidget } from "./widgets/CustomAudioWidget";
import { DivWidget } from "./widgets/DivWidget";

//Represents the media-player accessible throughout the whole page.
export class PlayerView extends View<PlayerViewModel> {
    constructor() {
        super();
        this.dataContext = getPlayerViewModel();
        let container = document.createElement("div");
        container.classList.add("player");
        this.renderBody = container;
        let hideButton = new ButtonWidget();
        hideButton.parentWidget = this;
        hideButton.text = "Show Player";
        hideButton.addOnClickEvent(() => this.dataContext.togglePlayer.run(null));
        this.widgets.push(hideButton);
        let playerDiv = new DivWidget();
        playerDiv.parentWidget = this;
        playerDiv.classList.add("invisible");
        this.dataContext.togglePlayerEvent = () => {
            playerDiv.classList.toggle("invisible");
            hideButton.text = `${playerDiv.classList.contains("invisible") ? "Show" : "Hide"} Player`;
        };
        let audio = new AudioWidget();
        audio.parentWidget = this;
        audio.src = "test.mp3";
        playerDiv.widgets.push(audio);
        //let audio = new CustomAudioWidget();
        playerDiv.widgets.push(audio);
        this.widgets.push(playerDiv);
        this.dataContext.songManager.songSwitched = async (song) => {
            audio.src = song.audioStreamUrl;
            await audio.play();
        }
    }

    shouldRender(): boolean {
        return true;
    }
}