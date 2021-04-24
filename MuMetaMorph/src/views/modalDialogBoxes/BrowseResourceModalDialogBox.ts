import { ITabNavigator, TabNavigator } from "../../core/render/ITabNavigator";
import { ModalDialog } from "../../core/render/ModalDialog";

export class BrowseResourceModalDialogBox extends ModalDialog {
    private tabNavigator: ITabNavigator;
    constructor(parentContainer: Element) {
        super(parentContainer);
        this.preventClickToExit = true;
        this.createDialog();
        this.createCloseButton();
    }
    private createDialog(): void {
        this.modalHeading.createElement("h1", h1 => h1.textContent = "Browse Resource");
        this.tabNavigator = new TabNavigator();
        let menuDiv = this.modalBody.createElement("div", element => {
            element.classList.add("tab");
        });
        this.tabNavigator.parentContainer = this.modalBody.renderBody;
        this.tabNavigator.menuDiv = menuDiv.renderBody as HTMLDivElement;
        let urlTab = this.tabNavigator.addTabMenuItem("URL", "urlTab", true);
        urlTab.createElement("p", p => p.textContent = "Use a Universal Resource Locator address");
    }
    private createCloseButton(): void {
        this.modalFooter.createElement("button", button => {
            button.classList.add('btn');
            button.textContent = "Use";
            button.addEventListener("click", () => this.close());
        });
    }
}