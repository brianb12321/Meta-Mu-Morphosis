import { Widget } from "../../core/render/Widget";

//A widget for the HTML heading tag.
export class HeadingWidget extends Widget {
    public headingNumber: number;
    public textContent: string;
    constructor(headingNumber: number, textContent: string) {
        super();
        this.headingNumber = headingNumber;
        this.textContent = textContent;
        let heading = document.createElement(`h${this.headingNumber}`);
        heading.textContent = this.textContent;
        this.renderBody = heading;
    }
    shouldRender(): boolean {
        return true;
    }
}