import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { IFormBuilder, SelectOption } from "./IFormBuilder";

export class HtmlWidgetFormBuilder implements IFormBuilder {
    constructor(private form: HtmlWidget, private appendChild: boolean = false) {

    }
    private addInput(label: string, inputId: string, inputType: string, required: boolean): HTMLInputElement {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        let input: HTMLInputElement;
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("input", element => {
                input = element as HTMLInputElement;
                element.classList.add("input-search");
                input.type = inputType;
                input.required = required;
                input.id = inputId;
            });
        return input;
    }
    addTextInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder {
        let input = this.addInput(label, inputId, "text", required);
        if (elementBuilder != null) elementBuilder(input);
        return this;
    }
    addDateInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder {
        let input = this.addInput(label, inputId, "date", required);
        if (elementBuilder != null) elementBuilder(input);
        return this;
    }
    addUrlInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder {
        let input = this.addInput(label, inputId, "url", required);
        if (elementBuilder != null) elementBuilder(input);
        return this;
    }
    addSelect(label: string,
        inputId: string,
        required: boolean,
        options: SelectOption[],
        elementBuilder?: (element: HTMLSelectElement) => void): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        let select: HTMLSelectElement;
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("select", element => {
                select = element as HTMLSelectElement;
                element.classList.add("input-search");
                select.required = required;
                select.id = inputId;
                for (let option of options) {
                    let optionElement: HTMLOptionElement = document.createElement("option");
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    select.options.add(optionElement);
                }
            });
        if (elementBuilder != null) elementBuilder(select);
        return this;
    }
    addResourceInput(label: string,
        inputId: string,
        required: boolean,
        browseButtonClicked: (urlInput: HTMLInputElement) => void,
        elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        let input: HTMLInputElement;
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("button", button => {
                button.classList.add("btn");
                button.textContent = "Browse";
                button.addEventListener("click", (evt) => {
                    evt.preventDefault();
                    browseButtonClicked(input);
                });
            })
            .createElementAndAppend("input", element => {
                input = element as HTMLInputElement;
                input.disabled = true;
                input.id = inputId;
            });
        if (elementBuilder != null) elementBuilder(input);
        return this;
    }
    addParagraph(paragraphText: string, elementBuilder?: (element: HTMLParagraphElement) => void): IFormBuilder {
        let element = this.form.createElement("p", p => p.textContent = paragraphText);
        if (elementBuilder != null) elementBuilder(element.renderBody as HTMLParagraphElement);
        return this;
    }
    addElement(elementName: string, elementBuilder: (element: HTMLElement) => void): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        row.createElement(elementName, elementBuilder);
        return this;
    }
    addFileInput(label: string,
        inputId: string,
        required: boolean,
        elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder {
        let input = this.addInput(label, inputId, "file", required);
        if (elementBuilder != null) elementBuilder(input);
        return this;
    }
    addTextarea(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLTextAreaElement) => void): IFormBuilder {
        let row = this.form.createElement("div", div => div.classList.add("row"), this.appendChild);
        let textarea: HTMLTextAreaElement;
        row.createElement("div", div => div.classList.add("col-25"))
            .createElementAndAppend("label", element => {
                let labelElement = element as HTMLLabelElement;
                labelElement.textContent = label;
                labelElement.htmlFor = inputId;
            });
        row.createElement("div", div => div.classList.add("col-75"))
            .createElementAndAppend("textarea", element => {
                element.classList.add("input-search");
                textarea = element as HTMLTextAreaElement;
                textarea.required = required;
                textarea.id = inputId;
            });
        if (elementBuilder != null) elementBuilder(textarea);
        return this;
    }
}