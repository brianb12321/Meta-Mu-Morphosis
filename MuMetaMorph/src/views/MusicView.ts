import { injectable } from "tsyringe";
import { View } from "../core/render/View";
import { getMusicViewModel } from "../viewModelCollection";
import { MusicViewModel } from "./viewModels/MusicViewModel";
import { HtmlWidget } from "./widgets/HtmlWidget";
import { TableWidget } from "./widgets/TableWidget";

@injectable()
export class MusicView extends View<MusicViewModel> {
    constructor() {
        super();
        this.dataContext = getMusicViewModel();
        let mainElement = document.createElement("main");
        this.renderBody = mainElement;
        let table = new TableWidget();
        table.addHeadingRow("Name");
        table.addHeadingRow("Artist");
        let row1 = table.addRow();
        row1.addRowDefinition("I Love you!");
        row1.addRowDefinition("Cool Artist");
        this.widgets.push(table);
        this.onRender = () => this.dataContext.logger.logDebug("[Music View]: Rendering...");
    }
    shouldRender(): boolean {
        return true;
    }
}