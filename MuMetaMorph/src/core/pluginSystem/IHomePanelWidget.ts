import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { SongMetadata } from "../music/SongMetadata";
import { IPluginComponent } from "./IPluginComponent";

/**
 * Represents a widget that can be added to a song's homepage.
 */
export interface IHomePanelWidget extends IPluginComponent {
    widgetId: string;
    widgetSize: WidgetSize;
    renderWidget(widgetContainer: HtmlWidget, pluginMetadata: SongMetadata): Promise<void>;
}
export enum WidgetSize {
    Fill, Normal
}