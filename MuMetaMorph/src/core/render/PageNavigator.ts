import { IContainer, Inject, Injectable } from "container-ioc";
import { IPageNavigator } from "./IPageNavigator";
import { INavBar } from "./INavBar";
import { IPageBody } from "./IPageBody";
import { TContainer, TNavBar, TLogger } from "../globalSymbols";
import { ILogger } from "../logging/ILogger";

@Injectable()
export class PageNavigator implements IPageNavigator {
    constructor(
        @Inject(TContainer)
        private container: IContainer,
        @Inject(TLogger)
        private logger: ILogger) {

    }
    navigationBar: INavBar;
    navigationRenderBody: HTMLElement;
    pageBodyRenderBody: HTMLElement;
    currentPageBody: IPageBody;
    async navigate(bodyName: string) {
        //I will find a better way later.
        this.currentPageBody = this.container.resolve("IPageBody-" + bodyName);
        //Clear body.
        this.pageBodyRenderBody.innerHTML = "";
        this.logger.log("[" + bodyName + "] " + "Rendering page body.");
        await this.currentPageBody.renderBody(this.pageBodyRenderBody);
    }
    async refreshNavBar() {
        this.logger.log("Rendering navigation bar");
        await this.navigationBar.renderNavBar(this.navigationRenderBody);
    }
}