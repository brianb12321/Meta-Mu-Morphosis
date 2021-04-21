///Utility interface for building forms without the need to interact with the DOM.
export interface IFormBuilder {
    addTextInput(label: string, inputId: string, required: boolean): IFormBuilder;
    addDateInput(label: string, inputId: string, required: boolean): IFormBuilder;
    addUrlInput(label: string, inputId: string, required: boolean): IFormBuilder;
    addElement(elementName: string, elementBuilder: (element: HTMLElement) => void): IFormBuilder;
    addParagraph(paragraphText: string): IFormBuilder;
}