import { ITabNavigator, TabNavigator } from "../core/render/ITabNavigator";
import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getMusicDetailsViewModel } from "../viewModelCollection";
import { MusicDetailsViewModel } from "./viewModels/MusicDetailsViewModel";
import { HtmlWidget } from './widgets/HtmlWidget';

export class MusicDetailsView extends View<MusicDetailsViewModel> {
    IMAGE_SIZE = 550;
    private tabNavigator: ITabNavigator;
    constructor(songId: number, private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getMusicDetailsViewModel();
        this.renderBody = document.createElement("main");
        this.renderBody.classList.add("main-musicDetails");
        this.tabNavigator = new TabNavigator();
        this.dataContext.setSongId(songId).then(() => {
            this.displayBanner(this.renderBody);
            let bodyDiv = document.createElement("div");
            bodyDiv.id = "musicDetailsBody";
            this.renderBody.appendChild(bodyDiv);
            this.dataContext.songEdited = () => {
                alert("Song Updated");
                this.refresh();
            }
            this.displayPluginTabAMenu(bodyDiv);
        });
    }
    private moveHome(): void {
        this.viewNavigator.navigate("Home", null);
    }
    private refresh(): void {
        this.viewNavigator.navigate("MusicDetails", { songId: this.dataContext.songId });
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
        let navigationBar = document.querySelector("nav");
        let main = document.querySelector(".main-musicDetails");
        main.setAttribute("style", `margin-top: ${navigationBar.clientHeight}px`);
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
        let exportLink = document.createElement("a");
        exportLink.textContent = "Export To JSON";
        exportLink.addEventListener("click", () => {
            this.dataContext.getSongJson().then(json => {
                let file = new Blob([json], { type: "text/plain" });
                let fileDownloader = document.createElement("a");
                fileDownloader.href = URL.createObjectURL(file);
                fileDownloader.download = "exportSong.json";
                fileDownloader.click();
            });
        });
        bannerControlList.appendChild(exportLink);
        bannerDiv.appendChild(bannerControl);
    }
    private addMainTab(html: Element, menuDiv: HTMLDivElement) {
        let mainPanel = this.tabNavigator.addTabMenuItem("Main", "mainPanel", true, null);
        mainPanel.createElement("h1", h1 => h1.textContent = "This is the main panel");
    }
    private async addSongPropertiesTab() {
        let propertiesWidget = this.tabNavigator.addTabMenuItem("Song Properties", "propertiesPanel", false, this.dataContext.songPropertiesPanel);
        await this.dataContext.songPropertiesPanel.renderContent(propertiesWidget, null);
    }
    private async loadPluginPanels() {
        for (let panel of this.dataContext.loadedPluginPanels) {
            let panelWidget = this.tabNavigator.addTabMenuItem(panel.panelName, panel.panelId, false, panel);
            await panel.renderContent(panelWidget, this.dataContext.getSongMetadataForPlugin(panel.basePlugin.pluginName));
        }
    }
    private displayPluginTabAMenu(html: Element) {
        let menuDiv = document.createElement("div");
        html.appendChild(menuDiv);
        menuDiv.classList.add("tab");
        this.tabNavigator.parentContainer = html;
        this.tabNavigator.menuDiv = menuDiv;
        this.addMainTab(html, menuDiv);
        this.addSongPropertiesTab().then(() => {
            this.loadPluginPanels();
        });
    }
    
    shouldRender(): boolean {
        return true;
    }
}