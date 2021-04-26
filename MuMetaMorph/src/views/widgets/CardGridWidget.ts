import { Widget } from "../../core/render/Widget";
import { HtmlWidget } from "./HtmlWidget";

export class CardGridWidget extends HtmlWidget {
    constructor() {
        super("div", "");
        this.renderBody.id = "card-div";
        this.renderBody.classList.add("card-grid");
    }

    public addCard(cardName: string, cardBody: string, appendChild = false, cardClicked: (card: HTMLElement) => void) {
        this.createElement("div", div => {
            div.classList.add("card", "card-grid-item");
            div.addEventListener("click", () => {
                if (cardClicked != null) {
                    cardClicked(div);
                }
            });
        }, appendChild)
            .createElement("div", div => div.classList.add("card-container"))
            .createElementAndAppend("h4", h4 => h4.textContent = cardName)
            .createElementAndAppend("p", (p: HTMLElement) => p.textContent = cardBody);
    }
    shouldRender(): boolean {
        return true;
    }
}