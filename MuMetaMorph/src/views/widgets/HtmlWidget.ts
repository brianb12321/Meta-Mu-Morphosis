import { Widget } from "../../core/render/Widget";

export class HtmlWidget extends Widget {
    private _element: HTMLElement;
    public get element(): HTMLElement {
        return this._element;
    }
    public set element(value: HTMLElement) {
        this._element = value;
        this.renderBody = value;
    }
    constructor(elementName: string, innerHTML: string) {
        super();
        this.element = document.createElement(elementName);
        this.element.innerHTML = innerHTML;
    }
    createElement(elementName: string, elementBuilder: (element: HTMLElement) => void): HtmlWidget {
        let htmlWidget = new HtmlWidget(elementName, "");
        this.widgets.push(htmlWidget);
        if (elementBuilder != null)
            elementBuilder(htmlWidget.element);

        return htmlWidget;
    }
    createElementAndAppend(elementName: string, elementBuilder: (element: HTMLElement) => void): HtmlWidget {
        let htmlWidget = new HtmlWidget(elementName, "");
        this.widgets.push(htmlWidget);
        if (elementBuilder != null)
            elementBuilder(htmlWidget.element);

        return this;
    }
    shouldRender(): boolean {
        return true;
    }
}