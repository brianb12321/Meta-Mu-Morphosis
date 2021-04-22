import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { IFormBuilder } from "./IFormBuilder";

export class HtmlWidgetFormBuilder implements IFormBuilder {

    constructor(private form: HtmlWidget, private appendChild: boolean = false) {

    }
    private addInput(label: string, inputId: string, inputType: string, required: boolean) {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("input", element => {
                let input = element as HTMLInputElement;
                element.classList.add("input-search");
                input.type = inputType;
                input.required = required;
                input.id = inputId;
            });
    }
    addTextInput(label: string, inputId: string, required: boolean): IFormBuilder {
        this.addInput(label, inputId, "text", required);
        return this;
    }
    addDateInput(label: string, inputId: string, required: boolean): IFormBuilder {
        this.addInput(label, inputId, "date", required);
        return this;
    }
    addUrlInput(label: string, inputId: string, required: boolean): IFormBuilder {
        this.addInput(label, inputId, "url", required);
        return this;
    }
    addParagraph(paragraphText: string): IFormBuilder {
        this.form.createElement("p", p => p.textContent = paragraphText);
        return this;
    }
    addElement(elementName: string, elementBuilder: (element: HTMLElement) => void): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        row.createElement(elementName, elementBuilder);
        return this;
    }
    addTextarea(label: string, inputId: string, required: boolean): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("textarea", element => {
                element.classList.add("input-search");
                let input = element as HTMLTextAreaElement;
                input.required = required;
                input.id = inputId;
            });
        return this;
    }
}