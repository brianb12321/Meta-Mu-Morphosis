import { inject, injectable } from "tsyringe";
import { IPageBody } from "../core/render/IPageBody";
import { TLogger } from "../core/globalSymbols";
import { ILogger } from "../core/logging/ILogger";

@injectable()
export class IndexPage implements IPageBody {

    navBar: HTMLElement;
    constructor(@inject(TLogger) private logger: ILogger) { }
    renderBody(renderBody: Element): void {
        let heading = document.createElement("h1");
        heading.textContent = "Index Page";
        renderBody.appendChild(heading);
    }
}