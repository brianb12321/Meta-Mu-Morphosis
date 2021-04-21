///Represents the entry-point of a plugin.
import { INewSongFormComponent } from "./INewSongFormComponent";

export abstract class PluginBase {
    public abstract get friendlyPluginName(): string;
    public abstract get pluginName(): string;
    public abstract get description(): string;
    public abstract get useNewSongForm(): boolean;
    getNewSongFormComponent(): INewSongFormComponent {
        return null;
    }
}