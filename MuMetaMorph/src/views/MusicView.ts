import { injectable } from "tsyringe";
import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getMusicViewModel } from "../viewModelCollection";
import { MusicViewModel } from "./viewModels/MusicViewModel";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { HtmlWidget } from "./widgets/HtmlWidget";

@injectable()
export class MusicView extends View<MusicViewModel> {
    constructor(private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getMusicViewModel();
        let mainElement = document.createElement("main");
        mainElement.classList.add("main");
        this.renderBody = mainElement;
        this.createButtons();
        let tableWidget = new HtmlWidget("table",
            `
<thead>
    <tr>
        <th>Name</th>
    </tr>
</thead>
`);
        this.dataContext.songManager.getSongs().then(songs => {
            let table = tableWidget.element as HTMLTableElement;
            let tableBody = document.createElement("tbody");
            table.appendChild(tableBody);
            for (let song of songs) {
                let row = tableBody.insertRow();
                let cell = row.insertCell();
                let anchor = document.createElement("a");
                anchor.href = "#";
                anchor.addEventListener("click", () => {
                    this.viewNavigator.navigate("MusicDetails", { songId: song.songId });
                });
                anchor.text = song.name;
                cell.appendChild(anchor);
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