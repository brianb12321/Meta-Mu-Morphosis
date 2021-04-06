import { Injectable } from "container-ioc";
import { INavBar } from "../core/render/INavBar";

@Injectable()
export class NavBar implements INavBar {
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
        anchor.addEventListener("click", () => alert("Test"));
        listItem.appendChild(anchor);
        navList.appendChild(listItem);
    }
}