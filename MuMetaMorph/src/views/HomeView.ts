import { HomeViewModel } from "./viewModels/HomeViewModel";
import { View } from "../core/render/View";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { AudioWidget } from "./widgets/AudioWidget";
import { InputWidget } from "./widgets/InputWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";

export class HomeView extends View<HomeViewModel>{
    private audioInputField: InputWidget;
    private testButton: ButtonWidget;
    constructor() {
        super();
        let mainElement = document.createElement("main");
        this.renderBody = mainElement;
        this.audioInputField = new InputWidget();
        this.audioInputField.parentWidget = this;
        this.testButton = new ButtonWidget();
        this.testButton.parentWidget = this;
        this.testButton.text = "Switch Song";
        let heading: HeadingWidget = new HeadingWidget(1, "Index Page");
        heading.parentWidget = this;
        this.widgets.push(heading);
        this.widgets.push(this.audioInputField);
        this.widgets.push(this.testButton);
    }
    shouldRender(): boolean {
        return true;
    }
}