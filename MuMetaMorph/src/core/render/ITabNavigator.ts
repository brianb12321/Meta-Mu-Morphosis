import { HtmlWidget } from "../../views/widgets/HtmlWidget";

/**
 * Utility interface for creating tabbed items.
 */
export interface ITabNavigator {
    parentContainer: Element;
    menuDiv: HTMLDivElement;
    tabs: Tab[];
    bodyElementType: string;
    buttonClassName: string;
    panelClassName: string;
    addTabMenuItem(tabName: string, tabId: string, defaultMenuItem: boolean, additionalData: any): HtmlWidget;
}

export class TabNavigator implements ITabNavigator {
    parentContainer: Element;
    menuDiv: HTMLDivElement;
    tabs: Tab[];
    bodyElementType: string = "div";
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
    private addTabMenuPanel(html: Element, panelId: string, tabButton: HTMLButtonElement, defaultRenderPanel: boolean = false): HtmlWidget {
        let panelTabDiv = new HtmlWidget(this.bodyElementType, "");
        panelTabDiv.shouldAppendChild = true;
        panelTabDiv.renderBody.classList.add(this.panelClassName);
        if (!defaultRenderPanel) {
            panelTabDiv.element.style.display = "none";
        }
        panelTabDiv.renderBody.id = panelId;
        tabButton.addEventListener("click", (evt) => {
            //Prevent the page from scrolling to the top.
            evt.preventDefault();
            this.openMenuTab((evt.currentTarget as HTMLButtonElement), panelTabDiv.renderBody.id);
        });
        return panelTabDiv;
    }
    private openMenuTab(button: HTMLButtonElement, tabId: string) {
        //Code-taken from https://www.w3schools.com/howto/howto_js_vertical_tabs.asp
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabPanel.element.style.display = "none";
        }
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabButton.className = this.tabs[i].tabButton.className.replace(" active", "");
        }
        this.tabs.find(tab => tab.tabPanel.element.id === tabId).tabPanel.element.style.display = "block";
        button.className += " active";
    }

    addTabMenuItem(tabName: string, tabId: string, defaultMenuItem: boolean, additionalData: any): HtmlWidget {
        let tabButton = this.addTabMenuButton(this.menuDiv, tabName);
        let tabPanel = this.addTabMenuPanel(this.parentContainer, tabId, tabButton, defaultMenuItem);
        this.parentContainer.appendChild(tabPanel.element);
        this.tabs.push({ tabButton: tabButton, tabPanel: tabPanel, additionalData: additionalData });
        if (defaultMenuItem) {
            this.openMenuTab(tabButton, tabPanel.element.id);
        }
        return tabPanel;
    }
}
export interface Tab {
    tabButton: HTMLButtonElement;
    tabPanel: HtmlWidget;
    additionalData: any;
}