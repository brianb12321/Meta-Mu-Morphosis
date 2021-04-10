import { Injectable, Inject, Container } from "container-ioc";
import { TLogger, TConfigManager, TPageNavigator, TThemeManager, TNavBar } from "../globalSymbols";
import { IApplication } from "./IApplication";
import { ILogger } from "../logging/ILogger";
import { IPageNavigator } from "../render/IPageNavigator";
import { INavBar } from "../render/INavBar";
import { IConfigurationManager } from "../configuration/IConfigurationManager";
import GlobalSymbols = require("../globalSymbols");
import { IndexDbConfigurationManager } from "../configuration/indexDb/IndexDbConfigurationManager";

@Injectable()
export class DefaultApplication implements IApplication {
    container: Container;
    logger: ILogger;
    configurationManager: IConfigurationManager;
    constructor() {
        
    }
    configureContainer(containerBuilder: Function): IApplication {
        if (containerBuilder != null) {
            this.container = containerBuilder();
        } else {
            this.container = new Container();
        }
        //Normally this would be bad practice (service-locator)m but the page navigator needs access to the container.
        this.container.register([{ token: GlobalSymbols.TContainer, useValue: this.container }]);
        //We are going to attempt to add a logger and configuration manager to the container
        this.container.register([
            { token: TLogger, useValue: this.logger },
            { token: TConfigManager, useValue: this.configurationManager }
        ]);
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
    async run(indexPageToken: any) {
        this.logger.log("Application started.");
        await this.loadTheme();
        let pageNavigator: IPageNavigator = this.container.resolve(TPageNavigator);
        let navigationBar: INavBar = this.container.resolve(TNavBar);
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
    }
    private async loadTheme() {
        this.logger.log("Loading css theme...");
        let themeManager: IThemeManager = this.container.resolve(TThemeManager);
        await themeManager.initialize();
        let fileRef = document.createElement("link");
        fileRef.rel = "stylesheet";
        fileRef.type = "text/css";
        fileRef.href = themeManager.getSelectedStylesheet();
        document.getElementsByTagName("head")[0].appendChild(fileRef);
        this.logger.log("Theme loaded.");
    }
}