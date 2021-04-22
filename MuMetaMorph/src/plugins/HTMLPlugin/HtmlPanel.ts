import { SongMetadata } from "../../core/music/SongMetadata";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { HtmlWidget } from "../../views/widgets/HtmlWidget";

export class HtmlPanel implements IMusicDetailsPanel {
    public get panelName(): string {
        return "HTML";
    }
    public get panelId(): string {
        return "HTML";
    }
    constructor(public basePlugin: PluginBase) {

    }
    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        let html: string = metadata.value["html"];
        content.createElement("div", div => div.innerHTML = html);
    }
}