import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getMusicDetailsViewModel } from "../viewModelCollection";
import { MusicDetailsViewModel } from "./viewModels/MusicDetailsViewModel";

export class MusicDetailsView extends View<MusicDetailsViewModel> {
    IMAGE_SIZE = 600;
    constructor(songId: number, private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getMusicDetailsViewModel();
        this.renderBody = document.createElement("main");
        this.renderBody.classList.add("main-musicDetails");
        this.dataContext.setSongId(songId).then(() => {
            this.displayBanner(this.renderBody);
        });
    }
    private moveHome(): void {
        this.viewNavigator.navigate("Home", null);
    }
    private displayBanner(html: Element) {
        let bannerDiv = document.createElement("div");
        bannerDiv.classList.add("music-banner");
        let bannerImageDiv = document.createElement("div");
        bannerImageDiv.classList.add("music-banner-image-div");
        bannerDiv.appendChild(bannerImageDiv);
        let image = document.createElement("img");
        //I want to resize the parent-div when the image gets resized.
        window.onresize = () => this.resizeImageDiv(bannerImageDiv, image.height);
        image.onload = () => this.resizeImageDiv(bannerImageDiv, image.height);
        image.classList.add("banner-image");
        image.src = this.dataContext.songBannerImageUrl;
        bannerImageDiv.appendChild(image);
        html.appendChild(bannerDiv);
        this.displayBannerControls(bannerDiv);
    }
    private resizeImageDiv(bannerImageDiv: HTMLDivElement, height: number) {
        bannerImageDiv.setAttribute("style", `height: ${(height <= this.IMAGE_SIZE) ? height : this.IMAGE_SIZE}px`);
    }
    private displayBannerControls(bannerDiv: HTMLDivElement) {
        let bannerControl = document.createElement("div");
        bannerControl.classList.add("banner-controls");
        let heading = document.createElement("h1");
        heading.textContent = this.dataContext.songName;
        bannerControl.appendChild(heading);
        let bannerControlList = document.createElement("div");
        bannerControlList.classList.add("banner-controls-list");
        bannerControl.appendChild(bannerControlList);
        let playLink = document.createElement("a");
        playLink.textContent = "Switch Audio";
        playLink.addEventListener("click", () => {
            this.dataContext.switchSong();
        });
        bannerControlList.appendChild(playLink);
        let deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete Song";
        deleteLink.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this song?")) {
                this.dataContext.deleteSong().then(() => this.moveHome());
            }
        })
        bannerControlList.appendChild(deleteLink);
        bannerDiv.appendChild(bannerControl);
    }
    shouldRender(): boolean {
        return true;
    }
}