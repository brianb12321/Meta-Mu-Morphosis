import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getMusicDetailsViewModel } from "../viewModelCollection";
import { MusicDetailsViewModel } from "./viewModels/MusicDetailsViewModel";
import { HtmlWidget } from "./widgets/HtmlWidget";

export class MusicDetailsView extends View<MusicDetailsViewModel> {
    IMAGE_SIZE = 550;
    constructor(songId: number, private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getMusicDetailsViewModel();
        this.renderBody = document.createElement("main");
        this.renderBody.classList.add("main-musicDetails");
        this.dataContext.setSongId(songId).then(() => {
            this.displayBanner(this.renderBody);
            let bodyDiv = document.createElement("div");
            bodyDiv.id = "musicDetailsBody";
            this.renderBody.appendChild(bodyDiv);
            this.displayPluginTabAMenu(bodyDiv);
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
        bannerDiv.appendChild(bannerControl);
    }
    private addTabMenuButton(menuDiv: HTMLDivElement, tabName: string): HTMLButtonElement {
        let tabButton = document.createElement("button");
        tabButton.classList.add("tablinks");
        tabButton.textContent = tabName;
        menuDiv.appendChild(tabButton);
        return tabButton;
    }
    private addTabMenuPanel(html: Element, panelId: string, tabButton: HTMLButtonElement, defaultRenderPanel: boolean = false): HTMLDivElement {
        let panelTabDiv = document.createElement("div");
        panelTabDiv.classList.add("tabcontent");
        if (!defaultRenderPanel) {
            panelTabDiv.style.display = "none";
        }
        panelTabDiv.id = panelId;
        tabButton.addEventListener("click", (evt) => this.openMenuTab((evt.currentTarget as HTMLButtonElement), panelTabDiv.id));
        return panelTabDiv;
    }
    private addTabMenuItem(html: Element, menuDiv: HTMLDivElement, tabName: string, tabId: string, defaultMenuItem: boolean = false): HtmlWidget {
        let tabButton = this.addTabMenuButton(menuDiv, tabName);
        let tabPanel = this.addTabMenuPanel(html, tabId, tabButton, defaultMenuItem);
        let widget = new HtmlWidget("div", "");
        widget.shouldAppendChild = true;
        html.appendChild(tabPanel);
        tabPanel.appendChild(widget.renderBody);
        if (defaultMenuItem) {
            this.openMenuTab(tabButton, tabPanel.id);
        }
        return widget;
    }
    private async loadPluginPanels(html: Element, menuDiv: HTMLDivElement) {
        for (let panel of this.dataContext.loadedPluginPanels) {
            let panelWidget = this.addTabMenuItem(html, menuDiv, panel.panelName, panel.panelId);
            await panel.renderContent(panelWidget, this.dataContext.getSongMetadataForPlugin(panel.basePlugin.pluginName));
        }
    }
    private displayPluginTabAMenu(html: Element) {
        let menuDiv = document.createElement("div");
        html.appendChild(menuDiv);
        menuDiv.classList.add("tab");
        let mainPanel = this.addTabMenuItem(html, menuDiv, "Main", "mainPanel", true);
        mainPanel.createElement("h1", h1 => h1.textContent = "This is the main panel");
        this.loadPluginPanels(html, menuDiv);
    }
    private openMenuTab(button: HTMLButtonElement, tabId: string) {
        //Code-taken from https://www.w3schools.com/howto/howto_js_vertical_tabs.asp
        let tabContent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabContent.length; i++) {
            (tabContent[i] as any).style.display = "none";
        }
        let tabLinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        document.getElementById(tabId).style.display = "block";
        button.className += " active";
    }
    shouldRender(): boolean {
        return true;
    }
}