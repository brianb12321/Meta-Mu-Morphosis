import { View } from "../core/render/View";
import { getAddNewSongViewModel } from "../viewModelCollection";
import { AddNewSongViewModel } from "./viewModels/AddNewSongViewModel";
import { HtmlWidget } from "./widgets/HtmlWidget";

export class AddNewSongView extends View<AddNewSongViewModel> {
    constructor() {
        super();
        this.dataContext = getAddNewSongViewModel();
        let mainElement = document.createElement("main");
        let html = new HtmlWidget("form", "");
        html.createElement("div", (div) => div.classList.add("form-element"))
            .createElementAndAppend("label", label => label.textContent = "Song Name")
            .createElementAndAppend("input", element => {
                let input = element as HTMLInputElement;
                input.type = "text";
                input.id = "songNameInput";
            });
        html.createElement("div", (div) => div.classList.add("form-element"))
            .createElementAndAppend("label", label => label.textContent = "Artist")
            .createElementAndAppend("input", element => {
                let input = element as HTMLInputElement;
                input.type = "text";
                input.id = "artistInput";
            });
        html.createElement("div", (div) => div.classList.add("form-element"))
            .createElementAndAppend("label", label => label.textContent = "Date Released")
            .createElementAndAppend("input", element => {
                let input = element as HTMLInputElement;
                input.type = "date";
                input.id = "dateReleasedInput";
            });
        html.createElement("div", (div) => div.classList.add("form-element"))
            .createElementAndAppend("label", label => label.textContent = "URL to audio")
            .createElementAndAppend("input", element => {
                let input = element as HTMLInputElement;
                input.type = "url";
                input.id = "urlInput";
            });
        html.createElement("div", (div) => div.classList.add("form-element"))
            .createElementAndAppend("button", element => {
                let button = element as HTMLButtonElement;
                button.id = "submit";
                button.type = "button";
                button.textContent = "Add Song";
                button.addEventListener("click", async () => {
                    this.dataContext.songName = (html.element.querySelector("div #songNameInput") as HTMLInputElement).value;
                    this.dataContext.artist = (html.element.querySelector("div #artistInput") as HTMLInputElement).value;
                    this.dataContext.dateReleased =
                        new Date(((html.element.querySelector("div #dateReleasedInput") as HTMLInputElement).value));
                    this.dataContext.audioStreamUrl = (html.element.querySelector("div #urlInput") as HTMLInputElement).value;
                    await this.dataContext.addSongAndClear();
                    html.element.querySelectorAll("div input").forEach(input => (input as HTMLInputElement).value = "");
                    alert("Song Added");
                });
            });

        this.renderBody = mainElement;
        this.widgets.push(html);
    }
    shouldRender(): boolean {
        return true;
    }
}