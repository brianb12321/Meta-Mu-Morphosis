import { container, injectable } from "tsyringe"
import { IApplication } from "./IApplication";
import { ILogger } from "../logging/ILogger";
import { IConfigurationManager } from "../configuration/IConfigurationManager";
import { IndexDbConfigurationManager } from "../configuration/indexDb/IndexDbConfigurationManager";
import { IStartupItem } from "./IStartupItem";
import { IThemeManager } from "../render/theme/IThemeManager";
import { TLogger, TConfigManager, TPageNavigator, TNavBar, TThemeManager, TStartupItem } from "../../globalSymbols";
import { ServiceExtensions } from "../../serviceExtensions";
import { MainView } from "../../views/mainView";

@injectable()
export class DefaultApplication implements IApplication {
    logger: ILogger;
    configurationManager: IConfigurationManager;
    constructor() {
        
    }
    configureContainer(containerBuilder: (serviceExtensions: ServiceExtensions) => void): IApplication {
        if (containerBuilder != null) {
            containerBuilder(new ServiceExtensions(this));
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
        for (let startupItem of container.resolveAll<IStartupItem>(TStartupItem)) {
            await startupItem.initialize();
        }
    }
    async run(indexPageToken: any) {
        await this.initializeStartupItems();
        await this.loadTheme();
        let body = document.querySelector("#render-body");
        let view: MainView = new MainView();
        view.renderBody = body;
        view.afterConstruction();
        await view.render();
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