///Represents the entry-point of a plugin.
import { IEditSongFormComponent } from "./IEditSongFormComponent";
import { IHomePanelWidget } from "./IHomePanelWidget";
import { IMusicDetailsPanel } from "./IMusicDetailsPanel";
import { INewSongFormComponent } from "./INewSongFormComponent";

export abstract class PluginBase {
    public abstract get friendlyPluginName(): string;
    public abstract get pluginName(): string;
    public abstract get description(): string;
    public abstract get useNewSongForm(): boolean;
    public abstract get useMusicDetailsPanels(): boolean;
    public abstract get useHomePanelWidget(): boolean;
    getNewSongFormComponent(): INewSongFormComponent {
        return null;
    }
    getEditSongFormComponent(): IEditSongFormComponent {
        return null;
    }
    getMusicDetailPanels(): IMusicDetailsPanel[] {
        return null;
    }
    getHomePanelWidget(): IHomePanelWidget {
        return null;
    }
}