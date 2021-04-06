import { Injectable, Inject, Container } from "container-ioc";
import { TContainer, TLogger, TPageNavigator, TThemeManager } from "../globalSymbols";
import { IApplication } from "./IApplication";
import { ILogger } from "../logging/ILogger";
import { IPageNavigator } from "../render/IPageNavigator";

@Injectable()
export class DefaultApplication implements IApplication {
    container: Container;
    logger: ILogger;
    constructor() {
        
    }
    configureContainer(containerBuilder: Function): IApplication {
        if (containerBuilder != null) {
            this.container = containerBuilder();
        } else {
            this.container = new Container();
        }
        //Normally this would be bad practice (service-locator)m but the page navigator needs access to the container.
        this.container.register([{ token: TContainer, useValue: this.container }]);

        //Going to hard-wire token for now.
        this.container.register([{ token: TLogger, useValue: this.logger }]);
        return this;
    }
    addLogger(logger: ILogger): IApplication {
        this.logger = logger;
        return this;
    }
    async run(indexPageToken: any) {
        this.logger.log("Application started.");
        this.loadTheme();
        let pageNavigator: IPageNavigator = this.container.resolve(TPageNavigator);
        let body = document.querySelector("#render-body");
        let bodyHeading = document.createElement("heading");
        let bodyMain = document.createElement("main");
        body.appendChild(bodyHeading);
        body.appendChild(bodyMain);
        await pageNavigator.refreshNavBar(bodyHeading);
        await pageNavigator.navigate("Index", bodyMain);
    }
    private loadTheme() {
        this.logger.log("Loading css theme...");
        let themeManager: IThemeManager = this.container.resolve(TThemeManager);
        let fileRef = document.createElement("link");
        fileRef.rel = "stylesheet";
        fileRef.type = "text/css";
        fileRef.href = themeManager.getSelectedStylesheet();
        document.getElementsByTagName("head")[0].appendChild(fileRef);
        this.logger.log("Theme loaded.");
    }
}