import { HtmlWidget } from "../../views/widgets/HtmlWidget";

export class ModalDialog {
    private modalContainer: HTMLDivElement;
    public modalHeading: HtmlWidget;
    public modalBody: HtmlWidget;
    public modalFooter: HtmlWidget;
    public preventClickToExit = false;
    public detachOnceClosed = true;
    constructor(private parentContainer: Element) {
        this.modalContainer = document.createElement("div");
        this.modalContainer.classList.add("modal");
        let modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        this.modalHeading = new HtmlWidget("div", "");
        this.modalHeading.renderBody.classList.add("modal-heading");
        this.modalHeading.shouldAppendChild = true;
        modalContent.appendChild(this.modalHeading.renderBody);
        this.modalBody = new HtmlWidget("div", "");
        this.modalBody.shouldAppendChild = true;
        this.modalBody.renderBody.classList.add("modal-body");
        modalContent.appendChild(this.modalBody.renderBody);
        this.modalFooter = new HtmlWidget("div", "");
        this.modalFooter.shouldAppendChild = true;
        this.modalFooter.renderBody.classList.add("modal-footer");
        modalContent.appendChild(this.modalFooter.renderBody);
        this.modalContainer.appendChild(modalContent);
        if (!this.detachOnceClosed) {
            parentContainer.appendChild(this.modalContainer);
        }
    }
    showDialog(): void {
        if (this.detachOnceClosed) {
            this.parentContainer.appendChild(this.modalContainer);
        }
        this.modalContainer.style.display = "block";
        window.onclick = (event: any) => {
            if (event.target === this.modalContainer) {
                if (!this.preventClickToExit) {
                    this.close();
                }
            }
        }
    }
    close(): void {
        this.modalContainer.style.display = "none";
        if (this.detachOnceClosed) {
            this.parentContainer.removeChild(this.modalContainer);
        }
    }
}