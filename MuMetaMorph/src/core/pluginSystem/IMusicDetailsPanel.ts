import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { ISong } from "../music/ISong";
import { SongMetadata } from "../music/SongMetadata";
import { IPluginComponent } from "./IPluginComponent";

/**
 * Represents a navigable page in the music-details view. Add any content that would not be appropriate in a widget as panel.
 */
export interface IMusicDetailsPanel extends IPluginComponent {
    panelName: string;
    panelId: string;
    song: ISong;
    renderContent(content: HtmlWidget, metadata: SongMetadata): Promise<void>;
}