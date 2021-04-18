import { Widget } from "../../core/render/Widget";
import { loadAnimation } from "lottie-web";

export class CustomAudioWidget extends Widget {

    constructor() {
        super();
        this.renderBody = document.createElement("div");
    }
    shouldRender(): boolean {
        return true;
    }
}