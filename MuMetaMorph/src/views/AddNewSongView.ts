import { INewSongFormComponent } from "../core/pluginSystem/INewSongFormComponent";
import { HtmlWidgetFormBuilder } from "../core/render/HTMLWidgetFormBuilder";
import { ITabNavigator } from '../core/render/ITabNavigator';
import { IViewNavigator } from "../core/render/IViewNavigator";
import { View } from "../core/render/View";
import { getAddNewSongViewModel } from "../viewModelCollection";
import { BrowseResourceModalDialogBox } from "./modalDialogBoxes/BrowseResourceModalDialogBox";
import { AddNewSongViewModel } from "./viewModels/AddNewSongViewModel";
import { AccordionWidget } from "./widgets/AccordionWidget";
import { CardGridWidget } from "./widgets/CardGridWidget";
import { HtmlWidget } from "./widgets/HtmlWidget";
import { ResourceType } from "../core/resourceSystem/Resource";

export class AddNewSongView extends View<AddNewSongViewModel> {
    constructor(private viewNavigator: IViewNavigator) {
        super();
        this.dataContext = getAddNewSongViewModel();
        this.dataContext.formData.main = {};
        let mainElement = document.createElement("main");
        mainElement.classList.add("main");
        let html = new HtmlWidget("form", "");
        (html.renderBody as HTMLFormElement).autocomplete = "off";
        html.renderBody.classList.add("form-center");
        let accordion = new AccordionWidget();
        html.widgets.push(accordion);
        accordion.accordionAdded = (section) => this.dataContext.accordionSections.push(section);
        let importJsonPanel = accordion.addAccordionSection("Import Song From JSON", false, null).panel;
        let importJsonForm = new HtmlWidgetFormBuilder(importJsonPanel);
        let browseModalDialog = new BrowseResourceModalDialogBox(this.dataContext.resourceManager, html.renderBody);
        importJsonForm.addParagraph("You have the ability to import a song from a JSON file.")
            .addFileInput("JSON File", "jsonFileInput", false, fileInput => {
                fileInput.accept = ".json";
            })
            .addElement("button", button => {
                button.classList.add("btn", "btn-submit");
                button.textContent = "Import";
                button.addEventListener("click", () => {
                    let jsonFileInput = document.querySelector("#jsonFileInput") as any;
                    if (jsonFileInput.files.length === 0) {
                        alert("Please select a file.");
                        return;
                    }
                    let file = jsonFileInput.files[0];
                    let fileReader = new FileReader();
                    fileReader.onload = async (evt) => {
                        let newSongId = await this.dataContext.importSongAndClear(fileReader.result.toString());
                        alert("Song Imported!");
                        viewNavigator.navigate("MusicDetails", { songId: newSongId });
                    }
                    fileReader.readAsText(file);
                });
            });
        let formPanel = accordion.addAccordionSection("New Song", false, null).panel;
        let formBuilder = new HtmlWidgetFormBuilder(formPanel);
        formBuilder.addTextInput("Song Name", "songNameInput", true)
            .addTextInput("Artist", "artistInput", true)
            .addUrlInput("URL To Song Image", "songImageInput", false)
            .addElement("div", div => {
                div.classList.add("admon-warning");
                div.textContent =
                    "WARNING: the image will be resized to fit the banner width. Any image size is allowed.";
            })
            .addResourceInput("Audio Resource", "urlInput", true, (input) => {
                browseModalDialog.showDialog();
            }, input => {
                browseModalDialog.valueSelected = (type, resourceId, name) => {
                    this.dataContext.formData.main.audioResourceId = resourceId;
                    input.value = `${ResourceType[type]}: ${name}`;
                };
            });
        let cardGrid = new CardGridWidget();
        html.widgets.push(cardGrid);
        this.renderCards(cardGrid, accordion);
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
                this.dataContext.formData.main.songName = (html.element.querySelector("div #songNameInput") as HTMLInputElement).value;
                this.dataContext.formData.main.artist = (html.element.querySelector("div #artistInput") as HTMLInputElement).value;
                this.dataContext.formData.main.songImageUrl =
                    (html.element.querySelector("div #songImageInput") as HTMLInputElement).value;
                this.populateFormData(accordion);
                let newSongId = await this.dataContext.addSongAndClear();
                alert("Song Added");
                viewNavigator.navigate("MusicDetails", { songId: newSongId });
            });
        });

        this.renderBody = mainElement;
        this.widgets.push(html);
    }

    private populateFormData(accordion: AccordionWidget) {
        for (let section of this.dataContext.accordionSections) {
            //Run code if section is associated with a plugin.
            if (section.additionalData != null) {
                let inputs = section.panel.renderBody.querySelectorAll(".row .col-75 .input-search");
                for (let j = 0; j < inputs.length; j++) {
                    let inputElement = inputs[j] as HTMLInputElement;
                    this.dataContext.formData[(section.additionalData as INewSongFormComponent).basePlugin.pluginName][inputElement.id] = inputElement.value;
                }
            }
        }
    }
    private addCard(cardGrid: CardGridWidget,
        accordionWidget: AccordionWidget,
        component: INewSongFormComponent,
        appendChild: boolean = false) {
        cardGrid.addCard(component.basePlugin.friendlyPluginName, (component.basePlugin.description as string) ?? "No Description has been provided for this plugin.", appendChild, (card) => {
            let section = accordionWidget.addAccordionSection(component.basePlugin.pluginName, true, component);
            let panel = section.panel;
            //Wire up the remove button.
            panel.createElement("button", button => {
                button.textContent = "Remove";
                button.classList.add("btn");
                button.addEventListener("click", () => {
                    accordionWidget.removeAccordionSection(panel);
                    this.dataContext.accordionSections.splice(
                        this.dataContext.accordionSections.indexOf(section),
                        1);
                    this.dataContext.pluginsUsed.splice(this.dataContext.pluginsUsed.indexOf(component), 1);
                    this.dataContext.formData[component.basePlugin.pluginName] = null;
                    this.addCard(cardGrid, accordionWidget, component, true);
                });
            });
            component.addForm(new HtmlWidgetFormBuilder(panel, true));
            //Segregate form data. We do not want plugins to read other plugin's form data.
            this.dataContext.formData[component.basePlugin.pluginName] = {};
            this.dataContext.pluginsUsed.push(component);
            cardGrid.renderBody.removeChild(card);
        });
    }
    private renderCards(cardGrid: CardGridWidget, accordionDiv: AccordionWidget): void {
        for (let component of this.dataContext.supportedPluginComponents) {
            this.addCard(cardGrid, accordionDiv, component);
        }
    }
    shouldRender(): boolean {
        return true;
    }
}