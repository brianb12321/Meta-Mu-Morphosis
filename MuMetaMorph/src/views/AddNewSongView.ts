import { INewSongFormComponent } from "../core/pluginSystem/INewSongFormComponent";
import { HtmlWidgetFormBuilder } from "../core/render/HTMLWidgetFormBuilder";
import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getAddNewSongViewModel } from "../viewModelCollection";
import { AccordionSection, AddNewSongViewModel } from "./viewModels/AddNewSongViewModel";
import { HtmlWidget } from "./widgets/HtmlWidget";

export class AddNewSongView extends View<AddNewSongViewModel> {
    constructor(private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getAddNewSongViewModel();
        let mainElement = document.createElement("main");
        mainElement.classList.add("main");
        let html = new HtmlWidget("form", "");
        let accordion = html.createElement("div", div => div.id = "accordion");
        let panel = this.addAccordionSection(accordion, "Section 1", false, null).panel;
        let formBuilder = new HtmlWidgetFormBuilder(panel);
        formBuilder.addTextInput("Song Name", "songNameInput", true)
            .addTextInput("Artist", "artistInput", true)
            .addDateInput("Date Released", "dateReleasedInput", true)
            .addUrlInput("URL To Song Image", "songImageInput", false)
            .addElement("div", div => {
                div.classList.add("admon-warning");
                div.textContent =
                    "WARNING: the image will be resized to fit the banner width. Any image size is allowed.";
            })
            .addUrlInput("URL To Audio", "urlInput", true);

        let cardDiv = html.createElement("div", div => {
            div.id = "card-div";
            div.classList.add("card-grid");
        });
        this.renderCards(cardDiv, accordion);
        html.createElement("button", element => {
            let button = element as HTMLButtonElement;
            button.id = "submit";
            button.classList.add("btn");
            button.classList.add("btn-submit");
            button.type = "button";
            button.textContent = "Add Song";
            button.addEventListener("click", async () => {
                if (!(html.renderBody as HTMLFormElement).checkValidity()) {
                    alert("Form not valid.");
                    return;
                }
                this.dataContext.formData.main = {};
                this.dataContext.formData.main.songName = (html.element.querySelector("div #songNameInput") as HTMLInputElement).value;
                this.dataContext.formData.main.artist = (html.element.querySelector("div #artistInput") as HTMLInputElement).value;
                this.dataContext.formData.main.dateReleased =
                    new Date(((html.element.querySelector("div #dateReleasedInput") as HTMLInputElement).value));
                this.dataContext.formData.main.songImageUrl =
                    (html.element.querySelector("div #songImageInput") as HTMLInputElement).value;
                this.dataContext.formData.main.audioStreamUrl = (html.element.querySelector("div #urlInput") as HTMLInputElement).value;
                this.populateFormData(accordion);
                let newSongId = await this.dataContext.addSongAndClear();
                alert("Song Added");
                viewNavigator.navigate("MusicDetails", { songId: newSongId });
            });
        });

        this.renderBody = mainElement;
        this.widgets.push(html);
    }
    private populateFormData(accordion: HtmlWidget) {
        for (let section of this.dataContext.accordionSections) {
            //Run code if section is associated with a plugin.
            if (section.component != null) {
                let inputs = section.panel.renderBody.querySelectorAll(".row .col-75 .input-search");
                for (let j = 0; j < inputs.length; j++) {
                    let inputElement = inputs[j] as HTMLInputElement;
                    this.dataContext.formData[section.component.basePlugin.pluginName][inputElement.id] = inputElement.value;
                }
            }
        }
    }
    private removeAccordionSection(panel: HtmlWidget, accordionDiv: HtmlWidget) {
        accordionDiv.removeElement(panel.parentWidget as HtmlWidget, true);
    }
    private addAccordionSection(accordionDiv: HtmlWidget, name: string, appendChild = false, component: INewSongFormComponent): AccordionSection {
        let accordionSection = accordionDiv.createElement("div", div => div.classList.add("accordion-section"), appendChild);
        accordionSection.createElement("button", button => {
            button.classList.add("accordion");
            button.textContent = name;
            this.setupAccordionEvents(button as HTMLButtonElement);
        }, appendChild);
        let panel = accordionSection.createElement("div", element => {
            element.classList.add("panel");
            element.classList.add("form-container");
        }, appendChild);
        let accordionSectionObj: AccordionSection = { accordionSection: accordionSection, component: component, panel: panel }
        this.dataContext.accordionSections.push(accordionSectionObj);
        return accordionSectionObj;
    }
    private setupAccordionEvents(accordion: HTMLButtonElement): void {
        accordion.addEventListener("click", () => {
            accordion.classList.toggle("active");
            let panel: any = accordion.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
    private addCard(cardDiv: HtmlWidget, accordionDiv: HtmlWidget, component: INewSongFormComponent, appendChild = false) {
        cardDiv.createElement("div", div => {
                div.classList.add("card", "card-grid-item");
                div.addEventListener("click",
                    () => {
                        let section = this.addAccordionSection(accordionDiv, component.basePlugin.pluginName, true, component);
                        let panel = section.panel;
                        //Wire up the remove button.
                        panel.createElement("button", button => {
                            button.textContent = "Remove";
                            button.classList.add("btn");
                            button.addEventListener("click", () => {
                                this.removeAccordionSection(panel, accordionDiv);
                                this.dataContext.accordionSections.splice(
                                    this.dataContext.accordionSections.indexOf(section),
                                    1);
                                this.dataContext.pluginsUsed.splice(this.dataContext.pluginsUsed.indexOf(component), 1);
                                this.dataContext.formData[component.basePlugin.pluginName] = null;
                                this.addCard(cardDiv, accordionDiv, component, true);
                            });
                        });
                        component.addForm(new HtmlWidgetFormBuilder(panel, true));
                        //Segregate form data. We do not want plugins to read other plugin's form data.
                        this.dataContext.formData[component.basePlugin.pluginName] = {};
                        this.dataContext.pluginsUsed.push(component);
                        cardDiv.renderBody.removeChild(div);
                    });
        }, appendChild)
            .createElement("div", div => div.classList.add("card-container"))
            .createElementAndAppend("h4", h4 => h4.textContent = component.basePlugin.pluginName)
            .createElementAndAppend("p", (p: HTMLElement) => p.textContent = component.basePlugin.description as string ?? "No Description has been provided for this plugin.");
    }
    private renderCards(html: HtmlWidget, accordionDiv: HtmlWidget): void {
        for (let component of this.dataContext.supportedPluginComponents) {
            this.addCard(html, accordionDiv, component);
        }
    }
    shouldRender(): boolean {
        return true;
    }
}