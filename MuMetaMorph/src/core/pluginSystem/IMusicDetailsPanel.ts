import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { SongMetadata } from "../music/SongMetadata";
import { IPluginComponent } from "./IPluginComponent";

/**
 * Represents a navigable page in the music-details view. Add any content that would not be appropriate in a widget as panel.
 */
export interface IMusicDetailsPanel extends IPluginComponent {
    panelName: string;
    panelId: string;
    renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void>;
}