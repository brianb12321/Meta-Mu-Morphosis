import { container, injectable } from "tsyringe"
import { TLogger, TConfigManager, TPageNavigator, TThemeManager, TNavBar } from "../globalSymbols";
import { IApplication } from "./IApplication";
import { ILogger } from "../logging/ILogger";
import { IPageNavigator } from "../render/IPageNavigator";
import { INavBar } from "../render/INavBar";
import { IConfigurationManager } from "../configuration/IConfigurationManager";
import GlobalSymbols = require("../globalSymbols");
import { IndexDbConfigurationManager } from "../configuration/indexDb/IndexDbConfigurationManager";
import { IStartupItem } from "./IStartupItem";
import { IThemeManager } from "../render/theme/IThemeManager";

@injectable()
export class DefaultApplication implements IApplication {
    logger: ILogger;
    configurationManager: IConfigurationManager;
    constructor() {
        
    }
    configureContainer(containerBuilder: Function): IApplication {
        if (containerBuilder != null) {
            containerBuilder();
        }
        //We are going to attempt to add a logger and configuration manager to the container
        container.registerInstance(TLogger, this.logger);
        container.registerInstance(TConfigManager, this.configurationManager);
        return this;
    }
    addLogger(logger: ILogger): IApplication {
        this.logger = logger;
        return this;
    }
    addConfigurationManager(configBuilder: Function): IApplication {
        if (configBuilder != null) {
            this.configurationManager = configBuilder();
        } else {
            this.configurationManager = new IndexDbConfigurationManager(this.logger);
        }
        
        return this;
    }
    async initializeStartupItems() {
        this.logger.log("Initializing startup items...");
        for (let startupItem of container.resolveAll<IStartupItem>(GlobalSymbols.TStartupItem)) {
            await startupItem.initialize();
        }
    }
    async run(indexPageToken: any) {
        await this.initializeStartupItems();
        await this.loadTheme();
        let pageNavigator: IPageNavigator = container.resolve(TPageNavigator);
        let navigationBar: INavBar = container.resolve(TNavBar);
        let body = document.querySelector("#render-body");
        let bodyHeading = document.createElement("heading");
        let bodyMain = document.createElement("main");
        body.appendChild(bodyHeading);
        body.appendChild(bodyMain);
        pageNavigator.navigationBar = navigationBar;
        pageNavigator.navigationRenderBody = bodyHeading;
        pageNavigator.pageBodyRenderBody = bodyMain;
        await pageNavigator.refreshNavBar();
        await pageNavigator.navigate(indexPageToken);
        this.logger.log("Application started.");
    }
    private async loadTheme() {
        this.logger.log("Loading css theme...");
        let themeManager: IThemeManager = container.resolve(TThemeManager);
        let fileRef = document.createElement("link");
        fileRef.rel = "stylesheet";
        fileRef.type = "text/css";
        fileRef.href = themeManager.getSelectedStylesheet();
        document.getElementsByTagName("head")[0].appendChild(fileRef);
        this.logger.log("Theme loaded.");
    }
}