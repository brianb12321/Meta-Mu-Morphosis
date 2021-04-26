import { Widget } from "../../core/render/Widget";

export class DivWidget extends Widget {
    public get classList(): DOMTokenList {
        return this.renderBody.classList;
    }
    constructor() {
        super();
        this.renderBody = document.createElement("div");
    }
    shouldRender(): boolean {
        return true;
    }
}