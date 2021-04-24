import { HtmlWidget } from "../../views/widgets/HtmlWidget";

/**
 * Utility interface for creating tabbed items.
 */
export interface ITabNavigator {
    parentContainer: Element;
    menuDiv: HTMLDivElement;
    buttonClassName: string;
    panelClassName: string;
    addTabMenuItem(tabName: string, tabId: string, defaultMenuItem: boolean): HtmlWidget;
}

export class TabNavigator implements ITabNavigator {
    parentContainer: Element;
    menuDiv: HTMLDivElement;
    tabs: Tab[];
    panelClassName: string = "tabcontent";
    buttonClassName: string = "tablinks";

    constructor() {
        this.tabs = [];
    }
    private addTabMenuButton(menuDiv: HTMLDivElement, tabName: string): HTMLButtonElement {
        let tabButton = document.createElement("button");
        tabButton.classList.add(this.buttonClassName);
        tabButton.textContent = tabName;
        menuDiv.appendChild(tabButton);
        return tabButton;
    }
    private addTabMenuPanel(html: Element, panelId: string, tabButton: HTMLButtonElement, defaultRenderPanel: boolean = false): HTMLDivElement {
        let panelTabDiv = document.createElement("div");
        panelTabDiv.classList.add(this.panelClassName);
        if (!defaultRenderPanel) {
            panelTabDiv.style.display = "none";
        }
        panelTabDiv.id = panelId;
        tabButton.addEventListener("click", (evt) => this.openMenuTab((evt.currentTarget as HTMLButtonElement), panelTabDiv.id));
        return panelTabDiv;
    }
    private openMenuTab(button: HTMLButtonElement, tabId: string) {
        //Code-taken from https://www.w3schools.com/howto/howto_js_vertical_tabs.asp
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabPanel.style.display = "none";
        }
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabButton.className = this.tabs[i].tabButton.className.replace(" active", "");
        }
        this.tabs.find(tab => tab.tabPanel.id === tabId).tabPanel.style.display = "block";
        button.className += " active";
    }

    addTabMenuItem(tabName: string, tabId: string, defaultMenuItem: boolean): HtmlWidget {
        let tabButton = this.addTabMenuButton(this.menuDiv, tabName);
        let tabPanel = this.addTabMenuPanel(this.parentContainer, tabId, tabButton, defaultMenuItem);
        let widget = new HtmlWidget("div", "");
        widget.shouldAppendChild = true;
        this.parentContainer.appendChild(tabPanel);
        tabPanel.appendChild(widget.renderBody);
        this.tabs.push({ tabButton: tabButton, tabPanel: tabPanel });
        if (defaultMenuItem) {
            this.openMenuTab(tabButton, tabPanel.id);
        }
        return widget;
    }
}
interface Tab {
    tabButton: HTMLButtonElement;
    tabPanel: HTMLDivElement;
}