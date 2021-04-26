import { Widget } from "../../core/render/Widget";

export class HtmlWidget extends Widget {
    private _element: HTMLElement;
    public shouldAppendChild: boolean;
    public get element(): HTMLElement {
        return this._element;
    }
    public set element(value: HTMLElement) {
        this._element = value;
        this.renderBody = value;
    }
    constructor(elementName: string, innerHTML: string) {
        super();
        if (elementName != null) {
            this.element = document.createElement(elementName);
            this.element.innerHTML = innerHTML;
        }
    }

    createElement(elementName: string, elementBuilder: (element: HTMLElement) => void, appendChild = false): HtmlWidget {
        let htmlWidget = new HtmlWidget(elementName, "");
        htmlWidget.parentWidget = this;
        if (this.renderBody == null) {
            this.renderBody = htmlWidget.renderBody;
        }
        if (appendChild || this.shouldAppendChild) {
            htmlWidget.shouldAppendChild = true;
            this.renderBody.appendChild(htmlWidget.renderBody);
        }

        this.widgets.push(htmlWidget);
        if (elementBuilder != null)
            elementBuilder(htmlWidget.element);

        return htmlWidget;
    }
    createElementAndAppend(elementName: string, elementBuilder: (element: HTMLElement) => void, appendChild = false): HtmlWidget {
        let htmlWidget = new HtmlWidget(elementName, "");
        htmlWidget.parentWidget = this;
        if (this.renderBody == null) {
            this.renderBody = htmlWidget.renderBody;
        }
        if (appendChild || this.shouldAppendChild) {
            htmlWidget.shouldAppendChild = true;
            this.renderBody.appendChild(htmlWidget.renderBody);
        }

        this.widgets.push(htmlWidget);
        if (elementBuilder != null)
            elementBuilder(htmlWidget.element);

        return this;
    }
    removeElement(element: HtmlWidget, removeChild = false) {
        if (removeChild) {
            this.renderBody.removeChild(element.renderBody);
        }
        this.widgets.splice(this.widgets.indexOf(element), 1);
    }
    //Helper methods
    createHeading(heading: string): HtmlWidget {
        return this.createElement("h1", h1 => h1.textContent = heading);
    }
    createParagraph(paragraph: string): HtmlWidget {
        return this.createElement("p", p => p.textContent = paragraph);
    }
    shouldRender(): boolean {
        return true;
    }
}