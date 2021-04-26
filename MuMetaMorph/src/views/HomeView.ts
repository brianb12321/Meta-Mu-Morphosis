import { HomeViewModel } from "./viewModels/HomeViewModel";
import { View } from "../core/render/View";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { ModalDialog } from "../core/render/ModalDialog";
import { HtmlWidget } from "./widgets/HtmlWidget";
import { getHomeViewModel } from "../viewModelCollection";
import { ISong } from "../core/music/ISong";

export class HomeView extends View<HomeViewModel>{
    constructor() {
        super();
        this.dataContext = getHomeViewModel();
        this.dataContext.title = "Home";
        let mainElement = document.createElement("main");
        mainElement.classList.add("main", "main-home");
        this.renderBody = mainElement;
        let heading = new HeadingWidget(1, "Welcome to Mu-Meta-Morph!");
        heading.renderBody.classList.add("text-center");
        let subText = new HtmlWidget("p", "");
        subText.element.textContent = "The most flexible music player on the face of the planet!";
        subText.element.classList.add("text-center");
        let div = new HtmlWidget("div", "");
        div.element.classList.add("main-banner");
        div.widgets.push(heading);
        div.widgets.push(subText);
        let mainBody = new HtmlWidget("div", "");
        mainBody.element.classList.add("main-home-body");
        let statisticsGridItem = mainBody.createElement("div",
            div => {
                div.classList.add("main-home-body-grid-item");
            });
        statisticsGridItem.createHeading("System Statistics");
        statisticsGridItem.createElementAndAppend("table",
            async element => {
                let table = element as HTMLTableElement;
                table.innerHTML = `
<thead>
<th>Statistic</th>
<th>Value</th>
</thead>
`;
                let body = table.createTBody();
                await this.addRowAsync(body,
                    "Number of Songs",
                    async () => {
                        let number = await this.dataContext.getNumberOfSongs();
                        return String(number);
                    });
                this.addRow(body,
                    "Number of Plugins Loaded",
                    () => String(this.dataContext.getNumberOfPlugins()));
            });
        let quickSwitchGridItem = mainBody.createElement("div",
            div => {
                div.classList.add("main-home-body-grid-item");
            });
        quickSwitchGridItem.createHeading("Switch Songs Quickly");
        quickSwitchGridItem.createElement("table",
            async element => {
                let table = element as HTMLTableElement;
                table.innerHTML = `
<thead>
<th>Name</th>
<th>Play</th>
</thead>
`;
                let body = table.createTBody();
                this.dataContext.getSongs().then(songs => {
                    for (let song of songs) {
                        this.addSongToTable(body, song);
                    }
                });
            });
        this.widgets.push(div);
        this.widgets.push(mainBody);
    }
    private async addRowAsync(tableBody: HTMLTableSectionElement, name: string, value: () => Promise<string>) {
        let songRow = tableBody.insertRow();
        let nameCell = songRow.insertCell();
        nameCell.textContent = name;
        let valueCell = songRow.insertCell();
        valueCell.textContent = await value();
    }
    private addRow(tableBody: HTMLTableSectionElement, name: string, value: () => string) {
        let songRow = tableBody.insertRow();
        let nameCell = songRow.insertCell();
        nameCell.textContent = name;
        let valueCell = songRow.insertCell();
        valueCell.textContent = value();
    }
    private addSongToTable(tableBody: HTMLTableSectionElement, song: ISong) {
        let songRow = tableBody.insertRow();
        let nameCell = songRow.insertCell();
        nameCell.textContent = song.name;
        let playCell = songRow.insertCell();
        let playAnchor = document.createElement("a");
        playAnchor.href = "#";
        playAnchor.textContent = "Play";
        playAnchor.addEventListener("click",
            async (evt: UIEvent) => {
                evt.preventDefault();
                await this.dataContext.switchSong(song.songId);
            });
        playCell.appendChild(playAnchor);
    };
    shouldRender(): boolean {
        return true;
    }
}