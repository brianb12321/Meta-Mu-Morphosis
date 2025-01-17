﻿///Utility interface for building forms without the need to interact with the DOM.
export interface IFormBuilder {
    addTextInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder;
    addDateInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder;
    addUrlInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder;
    addResourceInput(label: string, inputId: string, required: boolean, browseButtonClicked: (urlInput: HTMLInputElement) => void, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder;
    addFileInput(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLInputElement) => void): IFormBuilder;
    addSelect(label: string, inputId: string, required: boolean, options: SelectOption[], elementBuilder?: (element: HTMLSelectElement) => void): IFormBuilder;
    addElement(elementName: string, elementBuilder: (element: HTMLElement) => void): IFormBuilder;
    addTextarea(label: string, inputId: string, required: boolean, elementBuilder?: (element: HTMLTextAreaElement) => void): IFormBuilder;
    addParagraph(paragraphText: string, elementBuilder?: (element: HTMLParagraphElement) => void): IFormBuilder;
}

export interface SelectOption {
    value: string;
    text: string;
}