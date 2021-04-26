import { View } from "../core/render/View";
import { ResourceType } from "../core/resourceSystem/Resource";
import { getPlayerViewModel } from "../viewModelCollection";
import { PlayerViewModel } from "./viewModels/PlayerViewModel";
import { AudioWidget } from "./widgets/AudioWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { HtmlWidget } from "./widgets/HtmlWidget";

//Represents the media-player accessible throughout the whole page.
export class PlayerView extends View<PlayerViewModel> {
    constructor() {
        super();
        this.dataContext = getPlayerViewModel();
        let container = document.createElement("div");
        container.classList.add("player");
        container.style.marginTop = "40px";
        this.renderBody = container;
        let hideButton = new ButtonWidget();
        hideButton.parentWidget = this;
        hideButton.text = "Show Player";
        hideButton.addOnClickEvent(() => this.dataContext.togglePlayer.run(null));
        this.widgets.push(hideButton);
        let playerDiv = new HtmlWidget("div", "");
        playerDiv.parentWidget = this;
        playerDiv.element.classList.add("invisible");
        this.dataContext.togglePlayerEvent = () => {
            playerDiv.element.classList.toggle("invisible");
            //Turn off transparency effect.
            if (!playerDiv.element.classList.contains("invisible")) {
                container.style.opacity = "1";
            } else {
                //Turn on transparency effect.
                container.style.opacity = ".75";
            }
            hideButton.text = `${playerDiv.element.classList.contains("invisible") ? "Show" : "Hide"} Player`;
        };
        let audio = new AudioWidget();
        audio.parentWidget = this;
        let audioSource: HTMLSourceElement = document.createElement("source");
        audio.renderBody.appendChild(audioSource);
        playerDiv.widgets.push(audio);
        //let audio = new CustomAudioWidget();
        this.widgets.push(playerDiv);
        this.dataContext.songManager.songSwitched = async (song) => {
            let resource = await this.dataContext.resourceManager.getResource(song.audioStreamResourceId);
            this.dataContext.logger.logDebug(
                `[Player]: Audio resource loaded. Resource Name: ${resource.resourceName}`);
            if (resource.resourceType === ResourceType.Url) {
                audioSource.src = resource.resourceBody;
            }
            else if (resource.resourceType === ResourceType.Blob) {
                let blob = resource.getBlob().blobData;
                this.dataContext.logger.logDebug(
                    `[Player]: Blob type "${blob.type}" of resource "${resource.resourceName}" will be loaded. Size: ${blob.size}`);
                let url = URL.createObjectURL(blob);
                this.dataContext.logger.logDebug(
                    `[Player]: Blob url generated at ${url}`);
                audioSource.src = url;
                audioSource.type = blob.type;
            }
            audio.load();
            await audio.play();
        }
    }

    shouldRender(): boolean {
        return true;
    }
}