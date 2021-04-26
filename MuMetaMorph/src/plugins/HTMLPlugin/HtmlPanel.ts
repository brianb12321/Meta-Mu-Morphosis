import { SongMetadata } from "../../core/music/SongMetadata";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { ISong } from "../../core/music/ISong";
import { IHomePanelWidget, WidgetSize } from "../../core/pluginSystem/IHomePanelWidget";

export class HtmlPanel implements IMusicDetailsPanel, IHomePanelWidget {
    public get widgetId(): string {
        return "htmlWidget";
    }
    public get panelName(): string {
        return "HTML";
    }
    public get panelId(): string {
        return "HTML";
    }
    song: ISong;
    widgetSize: WidgetSize = WidgetSize.Fill;
    constructor(public basePlugin: PluginBase) {

    }

    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        let html: string = metadata.value["html"];
        content.element.innerHTML = html;
    }
    async renderWidget(widgetContainer: HtmlWidget, pluginMetadata: SongMetadata): Promise<void> {
        let html: string = pluginMetadata.value["html"];
        widgetContainer.element.innerHTML = html;
    }
}