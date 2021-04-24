import { HomeViewModel } from "./viewModels/HomeViewModel";
import { View } from "../core/render/View";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { ModalDialog } from "../core/render/ModalDialog";

export class HomeView extends View<HomeViewModel>{
    private testButton: ButtonWidget;
    constructor() {
        super();
        let mainElement = document.createElement("main");
        mainElement.classList.add("main");
        this.renderBody = mainElement;
        this.testButton = new ButtonWidget();
        this.testButton.text = "Open Dialog";
        let dialog = new ModalDialog(mainElement);
        dialog.modalHeading.createElement("h1", h1 => h1.textContent = "This is a modal dialog box.");
        this.testButton.addOnClickEvent(() => {
            dialog.showDialog();
        });
        let heading: HeadingWidget = new HeadingWidget(1, "Index Page");
        heading.parentWidget = this;
        this.widgets.push(heading);
        this.widgets.push(this.testButton);
    }
    shouldRender(): boolean {
        return true;
    }
}