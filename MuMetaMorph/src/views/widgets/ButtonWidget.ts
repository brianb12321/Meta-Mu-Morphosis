import { Widget } from "../../core/render/Widget";

export class ButtonWidget extends Widget {
    private button: HTMLButtonElement;
    public get text(): string {
        return this.button.textContent;
    }
    public set text(value: string) {
        this.button.textContent = value;
    }
    addOnClickEvent(clickEvent: Function): void {
        this.button.addEventListener("click", () => clickEvent());
    }
    constructor() {
        super();
        this.button = document.createElement("button");
        this.renderBody = this.button;
    }
    shouldRender(): boolean {
        return true;
    }
}