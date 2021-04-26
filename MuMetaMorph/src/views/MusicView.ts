import { injectable } from "tsyringe";
import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getMusicViewModel } from "../viewModelCollection";
import { MusicViewModel } from "./viewModels/MusicViewModel";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { HtmlWidget } from "./widgets/HtmlWidget";

@injectable()
export class MusicView extends View<MusicViewModel> {
    constructor(private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getMusicViewModel();
        let mainElement = document.createElement("main");
        mainElement.classList.add("main", "main-music");
        this.renderBody = mainElement;
        let heading = new HeadingWidget(1, "Music");
        this.widgets.push(heading);
        this.createButtons();
        let tableWidget = new HtmlWidget("table",
            `
<thead>
    <tr>
        <th>Name</th>
        <th>Date And Time Added</th>
    </tr>
</thead>
`);
        this.dataContext.songManager.getSongs().then(songs => {
            let table = tableWidget.element as HTMLTableElement;
            let tableBody = document.createElement("tbody");
            table.appendChild(tableBody);
            for (let song of songs) {
                let row = tableBody.insertRow();
                let nameCell = row.insertCell();
                let anchor = document.createElement("a");
                anchor.href = "#";
                anchor.addEventListener("click", () => {
                    this.viewNavigator.navigate("MusicDetails", { songId: song.songId });
                });
                anchor.text = song.name;
                nameCell.appendChild(anchor);
                let dateCell = row.insertCell();
                dateCell.textContent = song.dateAdded.toLocaleString();
            }
        });
        this.widgets.push(tableWidget);
    }
    createButtons(): void {
        let button = new ButtonWidget();
        button.addOnClickEvent(() => {
            this.viewNavigator.navigate("AddNewSong", null);
        });
        button.text = "Add Song";
        this.widgets.push(button);
    }
    shouldRender(): boolean {
        return true;
    }
}