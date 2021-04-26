import { HtmlWidget } from "../../views/widgets/HtmlWidget";
import { PluginBase } from "./PluginBase";

/**
 * Base interface for any component registered to PluginBase.
 */
export interface IPluginComponent {
    basePlugin: PluginBase;
}