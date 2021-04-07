import { Inject, Injectable } from "container-ioc";
import { TPageNavigator } from "../core/globalSymbols";
import { INavBar } from "../core/render/INavBar";
import { IPageNavigator } from "../core/render/IPageNavigator";

@Injectable()
export class NavBar implements INavBar {
    constructor(@Inject(TPageNavigator) private pageNavigator: IPageNavigator) {

    }

    async renderNavBar(renderBody: HTMLElement) {
        let navBar = document.createElement("nav");
        //create the navigation list.
        let navList = document.createElement("ul");
        this.addNavLink("Home", navList);
        this.addNavLink("Music", navList);
        this.addNavLink("About", navList);
        navBar.appendChild(navList);
        renderBody.appendChild(navBar);
    }
    addNavLink(linkName: string, navList: HTMLElement) {
        let listItem = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.text = linkName;
        anchor.addEventListener("click", (event: any) => this.pageNavigator.navigate(event.target.text));
        listItem.appendChild(anchor);
        navList.appendChild(listItem);
    }
}