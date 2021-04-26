import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { ISong } from "../../core/music/ISong";
import { HtmlWidget } from "../widgets/HtmlWidget";
import { SongMetadata } from "../../core/music/SongMetadata";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { MusicDetailsViewModel } from "../viewModels/MusicDetailsViewModel";
import { IHomePanelWidget, WidgetSize } from "../../core/pluginSystem/IHomePanelWidget";

export class HomePanel implements IMusicDetailsPanel {
    public basePlugin: PluginBase;
    private gridItems: GridItem[];
    song: ISong;
    public get panelName(): string {
        return "Home";
    }
    public get panelId(): string {
        return "homePanel";
    }
    constructor(private viewModel: MusicDetailsViewModel) {

    }

    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        content.createHeading("Home!");
        //Check if song resource actually exist. If not, warn the user.
        if (this.viewModel.noAudioPresent) {
            content.createElement("div", div => {
                div.classList.add("admon-warning");
                div.textContent = "No audio resource found. Please select an audio resource in song properties.";
            });
        }
        this.gridItems = [];
        let addWidgetDiv = content.createElement("div", div => { });
        let select: HTMLSelectElement;
        addWidgetDiv.createElement("select",
            element => {
                select = element as HTMLSelectElement;
                for (let supportedPlugin of this.viewModel.loadedPlugins.filter(plugin => plugin.useHomePanelWidget)) {
                    let option = document.createElement("option");
                    option.id = supportedPlugin.pluginName;
                    option.value = supportedPlugin.pluginName;
                    option.text = supportedPlugin.friendlyPluginName;
                    select.options.add(option);
                }
            });
        let widgetGrid: HtmlWidget;
        let fillZone: HtmlWidget;
        addWidgetDiv.createElement("div",
                buttonDiv => {
                    buttonDiv.classList.add("btn-group-horizontal");
                })
            .createElementAndAppend("button",
                element => {
                    let btn = element as HTMLButtonElement;
                    btn.classList.add("btn");
                    btn.textContent = "Insert";
                    if (select.options.length === 0) {
                        btn.disabled = true;
                    }
                    btn.addEventListener("click",
                        (evt) => {
                            evt.preventDefault();
                            let widget = this.viewModel.getPluginByName(select.options[select.selectedIndex].value)
                                .getHomePanelWidget();
                            if (widget != null) {
                                let item: GridItem;
                                switch (widget.widgetSize) {
                                    case WidgetSize.Normal:
                                        let gridItem = this.addPluginToArea(widgetGrid, widget, "widget-grid-item");
                                        this.gridItems.push(gridItem);
                                        break;
                                    case WidgetSize.Fill:
                                        let fillZoneItem = this.addPluginToArea(fillZone, widget, "widget-fill-zone-item");
                                        break;
                                }
                                select.options.remove(select.selectedIndex);
                                //Check if select is empty.
                                if (select.options.length === 0) {
                                    btn.disabled = true;
                                }
                            }
                        });
                })
            .createElementAndAppend("button",
                element => {
                    let button = element as HTMLButtonElement;
                    button.classList.add("btn");
                    button.textContent = "Toggle Grid Layout";
                    button.addEventListener("click",
                        (evt) => {
                            evt.preventDefault();
                            if (widgetGrid.element.classList.contains("widget-grid")) {
                                widgetGrid.element.classList.remove("widget-grid");
                                widgetGrid.element.classList.add("widget-grid-half");
                            }
                            else if (widgetGrid.element.classList.contains("widget-grid-half")) {
                                widgetGrid.element.classList.remove("widget-grid-half");
                                widgetGrid.element.classList.add("widget-grid-one");
                            }
                            else if (widgetGrid.element.classList.contains("widget-grid-one")) {
                                widgetGrid.element.classList.remove("widget-grid-one");
                                widgetGrid.element.classList.add("widget-grid");
                            }
                        });
                });
        widgetGrid = content.createElement("div",
            div => {
                div.classList.add("widget-grid");
            });
        fillZone = content.createElement("div",
            div => {
                div.classList.add("widget-fill-zone");
            });
    }
    private redrawGrid(grid: HtmlWidget) {
        grid.clear();
        for (let gridItem of this.gridItems) {
            this.addPluginToArea(grid, gridItem.gridWidget, "widget-grid-item");
        }
    }
    private addPluginToArea(area: HtmlWidget, widgetComponent: IHomePanelWidget, className: string): GridItem {
        let gridItemWidget = area.createElement("div",
            gridItem => {
                gridItem.classList.add(className);
                gridItem.id = widgetComponent.widgetId;
            });
        widgetComponent.renderWidget(gridItemWidget,
            this.viewModel.getSongMetadataForPlugin(widgetComponent.basePlugin.pluginName));
        return { gridItem: gridItemWidget, gridWidget: widgetComponent };
    }
}
interface GridItem {
    gridItem: HtmlWidget;
    gridWidget: IHomePanelWidget;
}