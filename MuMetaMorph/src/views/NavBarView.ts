import { View } from "../core/render/View";
import { getNavigationBarViewModel } from "../viewModelCollection";
import { NavigationBarViewModel } from "./viewModels/NavigationBarViewModel";

//Renders the site navigation bar.
export class NavBarView extends View<NavigationBarViewModel> {
    //Executed when a navigation link is clicked.
    public navItemClicked: (linkName: string) => void;
    private navList: HTMLElement;
    constructor() {
        super();
        this.dataContext = getNavigationBarViewModel();
        //create the navigation list.
        this.navList = document.createElement("ul");
        this.renderBody = document.createElement("heading");
        this.onRender = () => {
            let navBar = document.createElement("nav");
            navBar.appendChild(this.navList);
            this.renderBody.appendChild(navBar);
        }
    }
    addNavLink(linkName: string) {
        let listItem = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.text = linkName;
        anchor.addEventListener("click", (event: any) => this.navItemClicked(event.target.text));
        listItem.appendChild(anchor);
        this.navList.appendChild(listItem);
    }
    shouldRender(): boolean {
        return true;
    }
}