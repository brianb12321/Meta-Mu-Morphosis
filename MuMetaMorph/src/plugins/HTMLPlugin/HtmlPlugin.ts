import { injectable } from "tsyringe";
import { IEditSongFormComponent } from "../../core/pluginSystem/IEditSongFormComponent";
import { IMusicDetailsPanel } from "../../core/pluginSystem/IMusicDetailsPanel";
import { INewSongFormComponent } from "../../core/pluginSystem/INewSongFormComponent";
import { PluginBase } from "../../core/pluginSystem/PluginBase";
import { HtmlFormComponent } from "./HtmlFormComponent";
import { HtmlPanel } from "./HtmlPanel";

@injectable()
export class HtmlPlugin extends PluginBase {
    get friendlyPluginName(): string { return "HTML Plugin"; }

    get pluginName(): string { return "HTMLPlugin"; }

    get description(): string { return "Allows custom HTML to be added to a music page." }

    get useNewSongForm(): boolean { return true; }

    get useMusicDetailsPanels(): boolean { return true; }
    getNewSongFormComponent(): INewSongFormComponent {
        return new HtmlFormComponent(this);
    }
    getMusicDetailPanels(): IMusicDetailsPanel[] {
        return [new HtmlPanel(this)];
    }
    getEditSongFormComponent(): IEditSongFormComponent {
        return new HtmlFormComponent(this);
    }
}