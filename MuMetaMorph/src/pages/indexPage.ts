import { Injectable, Inject } from "container-ioc";
import { IPageBody } from "../core/render/IPageBody";
import { TLogger } from "../core/globalSymbols";
import { ILogger } from "../core/logging/ILogger";

@Injectable()
export class IndexPage implements IPageBody {

    navBar: HTMLElement;
    constructor(@Inject(TLogger) private logger: ILogger) { }
    renderBody(renderBody: Element): void {
        let heading = document.createElement("h1");
        heading.textContent = "Index Page";
        renderBody.appendChild(heading);
    }
}