import { View } from "../core/render/View";
import { MainViewModel } from "./viewModels/MainViewModel";
import { getMainViewModel } from "../viewModelCollection";
import { NavBarView } from "./NavBarView";
import { Widget } from "../core/render/Widget";
import { HomeView } from "./HomeView";
import { MusicView } from "./MusicView";
import { PlayerView } from "./PlayerView";
import { AddNewSongView } from "./AddNewSongView";
import { MusicDetailsView } from "./MusicDetailsView";
import { IViewNavigator } from "../core/render/IViewNavigator";
import { AboutView } from "./AboutView";

export class MainView extends View<MainViewModel> implements IViewNavigator {
    private navigationView: NavBarView;
    private bodyWidget: Widget;
    private playerWidget: Widget;
    constructor() {
        super();
        this.navigationView = new NavBarView();
        this.bodyWidget = new HomeView();
        this.playerWidget = new PlayerView();
        this.afterConstruction = this.afterConstructionFunction;
        this.dataContext = getMainViewModel();
    }
    private afterConstructionFunction() {
        this.navigationView.parentWidget = this;
        this.navigationView.renderOnce = true;
        this.navigationView.navItemClicked = (name) => {
            this.navigate(name, null);
        };
        this.navigationView.addNavLink("Home");
        this.navigationView.addNavLink("Music");
        this.navigationView.addNavLink("About");
        this.dataContext.logger.logDebug("[Main View]: Added navigation links.");
        this.bodyWidget.parentWidget = this;
        this.playerWidget.renderOnce = true;
        this.playerWidget.parentWidget = this;
        this.dataContext.logger.logDebug("[Main View]: Widgets added");
        this.widgets.push(this.navigationView);
        this.widgets.push(this.bodyWidget);
        this.widgets.push(this.playerWidget);
    }
    async navigate(viewToSwitch: string, args: any): Promise<void> {
        switch (viewToSwitch) {
        case "Home":
            this.bodyWidget = new HomeView();
            this.bodyWidget.parentWidget = this;
            this.widgets[1] = this.bodyWidget;
            this.clear();
            await this.render();
            break;
        case "Music":
            this.dataContext.logger.logDebug("[Main View]: Music navigation link clicked.");
            this.bodyWidget = new MusicView(this);
            this.widgets[1] = this.bodyWidget;
            this.bodyWidget.parentWidget = this;
            this.clear();
            await this.render();
            break;
        case "AddNewSong":
            this.dataContext.logger.logDebug("[Main View]: Add new song view requested.");
            this.bodyWidget = new AddNewSongView(this);
            this.bodyWidget.parentWidget = this;
            this.widgets[1] = this.bodyWidget;
            this.clear();
            await this.render();
            break;
        case "MusicDetails":
            this.dataContext.logger.logDebug(`[Main View]: Music details for songId '${args.songId}' requested.`);
            this.bodyWidget = new MusicDetailsView(args.songId, this);
            this.bodyWidget.parentWidget = this;
            this.widgets[1] = this.bodyWidget;
            this.clear();
            await this.render();
            break;
        case "About":
            this.dataContext.logger.logDebug(`[Main View]: About view requested.`);
            this.bodyWidget = new AboutView();
            this.bodyWidget.parentWidget = this;
            this.widgets[1] = this.bodyWidget;
            this.clear();
            await this.render();
            break;
        }
    }
    async render(): Promise<void> {
        this.dataContext.logger.logDebug("[Main View]: Rendering main view...");
        await super.render();
    }
    shouldRender(): boolean {
        return true;
    }
}