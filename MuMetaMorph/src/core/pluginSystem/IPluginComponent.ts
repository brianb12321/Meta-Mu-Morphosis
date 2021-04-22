import { PluginBase } from "./PluginBase";

/**
 * Base interface for any component registered to PluginBase.
 */
export interface IPluginComponent {
    basePlugin: PluginBase;
}