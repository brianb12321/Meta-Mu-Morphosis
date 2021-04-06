import { IContainer, Inject, Injectable } from "container-ioc";
import { IPageNavigator } from "./IPageNavigator";
import { INavBar } from "./INavBar";
import { IPageBody } from "./IPageBody";
import { TContainer, TNavBar, TLogger } from "../globalSymbols";
import { ILogger } from "../logging/ILogger";

@Injectable()
export class PageNavigator implements IPageNavigator {
    constructor(
        @Inject(TNavBar)
        public navigationBar: INavBar,
        @Inject(TContainer)
        private container: IContainer,
        @Inject(TLogger)
        private logger: ILogger) {

    }

    currentPageBody: IPageBody;
    async navigate(bodyName: string, renderBody: HTMLElement) {
        //I will find a better way later.
        this.currentPageBody = this.container.resolve("IPageBody-" + bodyName);
        //Clear body.
        renderBody.innerHTML = "";
        this.logger.log("Rendering page body.");
        await this.currentPageBody.renderBody(renderBody);
    }
    async refreshNavBar(renderBody: HTMLElement) {
        this.logger.log("Rendering navigation bar");
        await this.navigationBar.renderNavBar(renderBody);
    }
}