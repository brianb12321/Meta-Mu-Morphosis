import { Widget } from "../../core/render/Widget";

export class InputWidget extends Widget {
    constructor() {
        super();
        let input = document.createElement("input");
        this.renderBody = input;
    }
    shouldRender(): boolean {
        return true;
    }
}