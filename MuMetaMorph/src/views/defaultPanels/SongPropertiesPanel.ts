﻿import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { HtmlWidget } from "../widgets/HtmlWidget";
import { SongMetadata } from "../../core/music/SongMetadata";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { ISong } from "../../core/music/ISong";
import { ITabNavigator, TabNavigator } from "../../core/render/ITabNavigator";
import { HtmlWidgetFormBuilder } from "../../core/render/HTMLWidgetFormBuilder";
import { MusicDetailsViewModel } from "../viewModels/MusicDetailsViewModel";
import { AccordionWidget, AccordionSection } from "../widgets/AccordionWidget";
import { CardGridWidget } from "../widgets/CardGridWidget";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { IEditSongFormComponent } from "../../core/pluginSystem/IEditSongFormComponent";
import { BrowseResourceModalDialogBox } from "../modalDialogBoxes/BrowseResourceModalDialogBox";
import { ResourceType } from "../../core/resourceSystem/Resource";

export class SongProeprtiesPanel implements IMusicDetailsPanel {
    public get panelName(): string { return "Song Properties"; }
    public get panelId(): string { return "songPropertiesPanel"; }
    public get basePlugin(): PluginBase { return null; }
    public song: ISong;
    private tabNavigator: ITabNavigator;
    private formData: any;
    supportedPluginComponents: INewSongFormComponent[];
    pluginsAdded: INewSongFormComponent[];
    editComponents: IEditSongFormComponent[];
    accordionSections: AccordionSection[];
    constructor(private viewModel: MusicDetailsViewModel) {
        this.supportedPluginComponents = [];
        this.pluginsAdded = [];
        this.formData = {};
        this.formData.main = {};
        this.accordionSections = [];
        this.editComponents = [];
        for (let notLoadedPlugin of viewModel.plugins.filter(plugin => viewModel.loadedPlugins.map(pluginObj => pluginObj.pluginName).includes(plugin.pluginName) === false)) {
            //Do not add plugins that are already added to a song.
            if (notLoadedPlugin.useNewSongForm) {
                this.supportedPluginComponents.push(notLoadedPlugin.getNewSongFormComponent());
            }
        }
    }
    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        this.tabNavigator = new TabNavigator();
        content.createElement("h1", h1 => h1.textContent = `Song Properties for ${this.song.name}`);
        let form = content.createElement("form", parentDiv => { });
        let browseModalDialog = new BrowseResourceModalDialogBox(this.viewModel.resourceManager, form.element);
        let tabContainer = form.createElement("div", div => {
            div.classList.add("tab-horizontal-container");
            this.tabNavigator.parentContainer = div;
        });
        tabContainer.createElement("div",
            div => {
                let menuDiv = div as HTMLDivElement;
                menuDiv.classList.add("tab-horizontal");
                this.tabNavigator.menuDiv = menuDiv;
                this.tabNavigator.buttonClassName = "tablinks-song-properties";
                this.tabNavigator.panelClassName = "tabcontent-horizontal";
            });

        let mainPanel = this.addTab("Main", "main", true, null);
        let pluginsUsedPanel = this.addTab("Plugins Used", "pluginsUsed", false, null);
        this.setupPluginsUsedPanel(pluginsUsedPanel);
        this.addPluginTabItems();
        mainPanel.renderBody.classList.add("form-container");
        let accordion = new AccordionWidget();
        accordion.accordionAdded = (section) => this.accordionSections.push(section);
        //Since a music-detail panel is not type widget. We will hook up the HTML element manually.
        mainPanel.renderBody.appendChild(accordion.renderBody);
        let editSongAccordionPanel = accordion.addAccordionSection("Edit Song", true, null);
        let formBuilder = new HtmlWidgetFormBuilder(editSongAccordionPanel.panel, true);
        formBuilder.addTextInput("Song Name", "songNameInput", true, input => input.value = this.song.name)
            .addTextInput("Artist", "artistInput", true, input => input.value = this.song.artist)
            .addUrlInput("URL To Song Image", "songImageInput", false, input => input.value = this.song.bannerImageUrl)
            .addElement("div", div => {
                div.classList.add("admon-warning");
                div.textContent =
                    "WARNING: the image will be resized to fit the banner width. Any image size is allowed.";
            })
            .addResourceInput("Audio Resource", "urlInput", true, (input) => {
                browseModalDialog.showDialog();
            }, input => {
                browseModalDialog.valueSelected = (type, resourceId, name) => {
                    this.formData.main.audioResourceId = resourceId;
                    input.value = `${ResourceType[type]}: ${name}`;
                };
                if (this.viewModel.audioResourceExists()) {
                    this.formData.main.audioResourceId = this.viewModel.getAudioResourceId();
                    input.value = `${ResourceType[this.viewModel.getAudioResourceType()]}: ${this.viewModel.getAudioResourceName()}`;
                }
            });
        let cardGrid = new CardGridWidget();
        mainPanel.renderBody.appendChild(cardGrid.renderBody);
        this.renderCards(cardGrid, accordion);
        form.createElement("button", button => {
            button.classList.add("btn");
            button.classList.add("btn-submit");
            button.style.marginTop = "10px";
            button.textContent = "Update Song";
            button.addEventListener("click", async () => {
                if (!(form.renderBody as HTMLFormElement).checkValidity()) {
                    alert("Form not valid.");
                    return;
                }
                this.formData.main.songName = (mainPanel.element.querySelector("div #songNameInput") as HTMLInputElement).value;
                this.formData.main.artist = (mainPanel.element.querySelector("div #artistInput") as HTMLInputElement).value;
                this.formData.main.songImageUrl =
                    (mainPanel.element.querySelector("div #songImageInput") as HTMLInputElement).value;
                this.formData.main.audioStreamUrl = (mainPanel.element.querySelector("div #urlInput") as HTMLInputElement).value;
                this.populateFormData(accordion);
                this.populateFormDataAcrossTabs();
                await this.viewModel.updateSong(this.pluginsAdded, this.editComponents, this.formData);
            });
        });
    }
    private setupPluginsUsedPanel(panel: HtmlWidget) {
        panel.createElement("p",
            p => p.textContent =
                "The following plugins have been loaded for this song. You can disable or remove plugins here.");
        panel.createElement("div", div => {
            div.classList.add("admon-warning");
            div.textContent = "WARNING: Any actions issued in this tab will automatically refresh the page.";
        });
        panel.createElement("table", element => {
            let table = element as HTMLTableElement;
            table.innerHTML = `
<thead>
<tr>
    <th>Name</th>
    <th>Friendly Name</th>
    <th>Actions</th>
</tr>
</thead>
`;
            let body = table.createTBody();
            for (let loadedPlugin of this.viewModel.loadedPlugins) {
                let row = body.insertRow();
                let nameCell = row.insertCell();
                nameCell.textContent = loadedPlugin.pluginName;
                let friendlyNameCell = row.insertCell();
                friendlyNameCell.textContent = loadedPlugin.friendlyPluginName;
                let actionCell = row.insertCell();
                this.insertPluginActions(actionCell, loadedPlugin.pluginName);
            }
        });
    }
    private insertListAnchor(parent: HTMLElement) {
        let listItem = document.createElement("li");
        let anchor = document.createElement("a");
        listItem.appendChild(anchor);
        parent.appendChild(anchor);
        return anchor;
    }
    private insertPluginActions(actionCell: HTMLTableCellElement, pluginName: string) {
        let list = document.createElement("ul");
        list.classList.add("table-list");
        let removeAction = this.insertListAnchor(list);
        removeAction.textContent = "Remove Plugin";
        removeAction.href = "#";
        removeAction.addEventListener("click", async (evt: UIEvent) => {
            evt.preventDefault();
            if (confirm(
                `Are you sure you want to remove plugin "${pluginName}"? All associated plugin data for this song will be deleted.`)) {
                await this.viewModel.removePlugin(pluginName);
            }
            return false;
        });
        actionCell.appendChild(list);
    }
    private addTab(tabName: string, tabId: string, defaultTab: boolean, component: IEditSongFormComponent): HtmlWidget {
        return this.tabNavigator.addTabMenuItem(tabName, tabId, defaultTab, component);
    }
    private addPluginTabItems() {
        for (let plugin of this.viewModel.loadedPlugins) {
            if (plugin.useNewSongForm) {
                let editSongTabItem = plugin.getEditSongFormComponent();
                if (editSongTabItem != null) {
                    let pluginTab = this.addTab(editSongTabItem.basePlugin.friendlyPluginName, editSongTabItem.basePlugin.pluginName, false, editSongTabItem);
                    editSongTabItem.addEditSongForm(new HtmlWidgetFormBuilder(pluginTab, true), this.viewModel.getSongMetadataForPlugin(editSongTabItem.basePlugin.pluginName));
                    this.editComponents.push(editSongTabItem);
                    this.formData[editSongTabItem.basePlugin.pluginName] = {};
                }
            }
        }
    }
    private populateFormData(accordion: AccordionWidget) {
        for (let section of this.accordionSections) {
            //Run code if section is associated with a plugin.
            if (section.additionalData != null) {
                let inputs = section.panel.renderBody.querySelectorAll(".row .col-75 .input-search");
                for (let j = 0; j < inputs.length; j++) {
                    let inputElement = inputs[j] as HTMLInputElement;
                    this.formData[(section.additionalData as INewSongFormComponent).basePlugin.pluginName][inputElement.id] = inputElement.value;
                }
            }
        }
    }
    private populateFormDataAcrossTabs() {
        for (let tab of this.tabNavigator.tabs) {
            //Run code if section is associated with a plugin.
            if (tab.additionalData != null) {
                let inputs = tab.tabPanel.element.querySelectorAll(".input-search");
                for (let j = 0; j < inputs.length; j++) {
                    let inputElement = inputs[j] as HTMLInputElement;
                    this.formData[(tab.additionalData as IEditSongFormComponent).basePlugin.pluginName][inputElement.id] = inputElement.value;
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
                    this.accordionSections.splice(
                        this.accordionSections.indexOf(section),
                        1);
                    this.pluginsAdded.splice(this.pluginsAdded.indexOf(component), 1);
                    this.formData[component.basePlugin.pluginName] = null;
                    this.addCard(cardGrid, accordionWidget, component, true);
                });
            });
            component.addForm(new HtmlWidgetFormBuilder(panel, true));
            //Segregate form data. We do not want plugins to read other plugin's form data.
            this.formData[component.basePlugin.pluginName] = {};
            this.pluginsAdded.push(component);
            cardGrid.renderBody.removeChild(card);
        });
    }
    private renderCards(cardGrid: CardGridWidget, accordionDiv: AccordionWidget): void {
        for (let component of this.supportedPluginComponents) {
            this.addCard(cardGrid, accordionDiv, component, true);
        }
    }
}