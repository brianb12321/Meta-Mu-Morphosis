import { SongMetadata } from "../../core/music/SongMetadata";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { ISong } from "../../core/music/ISong";

export class HtmlPanel implements IMusicDetailsPanel {
    public get panelName(): string {
        return "HTML";
    }
    public get panelId(): string {
        return "HTML";
    }
    song: ISong;
    constructor(public basePlugin: PluginBase) {

    }

    async renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void> {
        let html: string = metadata.value["html"];
        content.element.innerHTML = html;
    }
}