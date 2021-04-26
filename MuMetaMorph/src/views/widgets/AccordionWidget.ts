import { HtmlWidget } from "./HtmlWidget";

export class AccordionWidget extends HtmlWidget {
    public accordionAdded: (accordionSection: AccordionSection) => void;
    constructor() {
        super("div", "");
    }
    public removeAccordionSection(panel: HtmlWidget) {
        this.removeElement(panel.parentWidget as HtmlWidget, true);
    }
    public addAccordionSection(name: string, appendChild = false, additionalData: any): AccordionSection {
        let accordionSection = this.createElement("div", div => div.classList.add("accordion-section"), appendChild);
        accordionSection.createElement("button", button => {
            button.classList.add("accordion");
            button.textContent = name;
            this.setupAccordionEvents(button as HTMLButtonElement);
        }, appendChild);
        let panel = accordionSection.createElement("div", element => {
            element.classList.add("panel");
            element.classList.add("form-container");
        }, appendChild);
        let accordionSectionObj: AccordionSection = { accordionSection: accordionSection, additionalData: additionalData, panel: panel }
        if (this.accordionAdded != null) {
            this.accordionAdded(accordionSectionObj);
        }
        return accordionSectionObj;
    }
    private setupAccordionEvents(accordion: HTMLButtonElement): void {
        accordion.addEventListener("click", (evt) => {
            //Prevent the page from scrolling to the top.
            evt.preventDefault();
            accordion.classList.toggle("active");
            let panel: any = accordion.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                panel.style.paddingBottom = "0";
            } else {
                panel.style.maxHeight = (panel.scrollHeight + 10) + "px";
                panel.style.paddingBottom = "10px";
            }
        });
    }
    shouldRender(): boolean {
        return true;
    }
}
export interface AccordionSection {
    accordionSection: HtmlWidget;
    panel: HtmlWidget;
    additionalData: any;
}