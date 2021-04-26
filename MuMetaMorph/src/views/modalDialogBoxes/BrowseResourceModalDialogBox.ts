import { ITabNavigator, TabNavigator } from "../../core/render/ITabNavigator";
import { ModalDialog } from "../../core/render/ModalDialog";
import { HtmlWidget } from "../widgets/HtmlWidget";
import { HtmlWidgetFormBuilder } from "../../core/render/HTMLWidgetFormBuilder";
import { ResourceType, Resource, ResourcePurpose } from "../../core/resourceSystem/Resource";
import { IResourceManager } from "../../core/resourceSystem/IResourceManager";
import { IBlobResource } from "../../core/resourceSystem/IBlobResource";

export class BrowseResourceModalDialogBox extends ModalDialog {
    private tabNavigator: ITabNavigator;
    private selectedResourceId: number = -1;
    public valueSelected: (type: ResourceType, resourceId: number, resourceName: string) => void;
    constructor(private resourceManager: IResourceManager, parentContainer: Element) {
        super(parentContainer);
        this.preventClickToExit = true;
        this.createDialog();
    }
    private createDialog(): void {
        this.modalBody.element.id = "browseResourceModalBody";
        this.modalFooter.element.id = "browseResourceModalFooter";
        this.modalHeading.createElement("h1", h1 => h1.textContent = "Browse Resource");
        this.tabNavigator = new TabNavigator();
        let menuDiv = this.modalBody.createElement("div", element => {
            element.classList.add("tab");
            element.id = "browseResourceMenuDiv";
        });
        this.tabNavigator.parentContainer = this.modalBody.renderBody;
        this.tabNavigator.menuDiv = menuDiv.renderBody as HTMLDivElement;
        let urlTab = this.tabNavigator.addTabMenuItem("URL", "urlTab", true, null);
        this.setupUrlTab(urlTab);
        let blobTab = this.tabNavigator.addTabMenuItem("Resource Blob", "blobTab", false, null);
        this.setupBlobTab(blobTab);
        this.createCloseButton();
    }
    private addResourceToTable(body: HTMLTableSectionElement, blobResource: Resource) {
        let row = body.insertRow();
        let selectCell = row.insertCell();
        let selectInput = document.createElement("input");
        selectInput.type = "radio";
        selectInput.value = `${blobResource.resourceId}`;
        selectInput.id = `radioId-${blobResource.resourceId}`;
        selectInput.name = "resource";
        selectInput.addEventListener("change", () => this.selectedResourceId = blobResource.resourceId);
        selectCell.appendChild(selectInput);
        let nameCell = row.insertCell();
        nameCell.textContent = blobResource.resourceName;
        let fileNameCell = row.insertCell();
        fileNameCell.textContent = blobResource.getBlob().fileName;
        let fileTypeCell = row.insertCell();
        fileTypeCell.textContent = ResourcePurpose[blobResource.resourcePurpose];
        let mimeCell = row.insertCell();
        mimeCell.textContent = blobResource.getBlob().blobData.type;
        let actionCell = row.insertCell();
        let deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.text = "Delete";
        deleteLink.addEventListener("click", async (evt: UIEvent) => {
            evt.preventDefault();
            await this.resourceManager.deleteResource(blobResource.resourceId);
            body.removeChild(row);
        });
        actionCell.appendChild(deleteLink);
    }
    private addUrlResourceToTable(body: HTMLTableSectionElement, urlResource: Resource) {
        let row = body.insertRow();
        let selectCell = row.insertCell();
        let selectInput = document.createElement("input");
        selectInput.type = "radio";
        selectInput.value = `${urlResource.resourceId}`;
        selectInput.id = `radioId-${urlResource.resourceId}`;
        selectInput.name = "resource";
        selectInput.addEventListener("change", () => this.selectedResourceId = urlResource.resourceId);
        selectCell.appendChild(selectInput);
        let nameCell = row.insertCell();
        nameCell.textContent = urlResource.resourceName;
        let urlCell = row.insertCell();
        urlCell.textContent = urlResource.resourceBody;
        let typeCell = row.insertCell();
        typeCell.textContent = ResourcePurpose[urlResource.resourcePurpose];
        let actionCell = row.insertCell();
        let deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.text = "Delete";
        deleteLink.addEventListener("click", async (evt: UIEvent) => {
            evt.preventDefault();
            await this.resourceManager.deleteResource(urlResource.resourceId);
            body.removeChild(row);
        });
        actionCell.appendChild(deleteLink);
    }
    private setupUrlTab(urlTab: HtmlWidget) {
        let useButton: HTMLButtonElement;
        urlTab.createParagraph(
            "Select a URL resource from the database or create a new URL resource. URL resource must be directly accessible.");
        urlTab.createElement("table", element => {
            let table = element as HTMLTableElement;
            table.innerHTML = `
<thead>
    <tr>
        <th>Select</th>
        <th>Name</th>
        <th>URL</th>
        <th>Type</th>
        <th>Action</th>
    </tr>
</thead>
`;
            let body = table.createTBody();
            this.resourceManager.getAllUrlResources().then(urls => {
                for (let blobResource of urls) {
                    this.addUrlResourceToTable(body, blobResource);
                }
                urlTab.createElement("div",
                    createUrlSection => {
                        createUrlSection.classList.add("group-box");
                        let form = new HtmlWidget("form", "");
                        form.element.classList.add("form-content");
                        form.shouldAppendChild = true;
                        createUrlSection.appendChild(form.element);
                        let formBuilder = new HtmlWidgetFormBuilder(form);
                        let fileInput: any;
                        formBuilder.addTextInput("Resource Name", "resourceNameInput", true);
                        formBuilder.addUrlInput("URL", "urlInput", true)
                            .addSelect("Type",
                                "fileTypeSelectUrl",
                                true,
                                [{ value: "0", text: "Song" }])
                            .addElement("div",
                                div => {
                                    div.classList.add("btn-group-horizontal");
                                    let button = document.createElement("button");
                                    div.appendChild(button);
                                    button.classList.add("btn");
                                    button.textContent = "Save";
                                    button.addEventListener("click",
                                        async (evt: UIEvent) => {
                                            evt.preventDefault();
                                            if (!(form.element as HTMLFormElement).checkValidity()) {
                                                alert("Validation failed: Please check form before submitting.");
                                                return;
                                            }
                                            //Begin work.
                                            button.disabled = true;
                                            useButton.disabled = true;
                                            button.textContent = "Working...";
                                            let resource = new Resource();
                                            resource.resourceName = (form.element.querySelector("#resourceNameInput") as
                                                HTMLInputElement).value;
                                            resource.resourcePurpose = ResourcePurpose.Song;
                                            resource.resourceType = ResourceType.Url;
                                            resource.resourceBody = (form.element.querySelector("#urlInput") as
                                                HTMLInputElement).value;
                                            let newResource = await this.resourceManager.addResource(resource);
                                            resource = null;
                                            this.addUrlResourceToTable(body, newResource);
                                            button.disabled = false;
                                            useButton.disabled = false;
                                            button.textContent = "Save";
                                        });
                                    useButton = document.createElement("button");
                                    div.appendChild(useButton);
                                    useButton.classList.add("btn");
                                    useButton.textContent = "Use Selected";
                                    useButton.addEventListener("click",
                                        async (evt) => {
                                            evt.preventDefault();
                                            //No url selected
                                            if (this.selectedResourceId === -1) {
                                                alert("You must select a URL from the table.");
                                                return;
                                            }
                                            if (this.valueSelected != null) {
                                                let resource =
                                                    await this.resourceManager.getResource(this.selectedResourceId);
                                                this.valueSelected(ResourceType.Url,
                                                    this.selectedResourceId,
                                                    resource.resourceName);
                                            }
                                            this.close();
                                        });
                                });
                    });
            });
        });
    }
    private setupBlobTab(blobTab: HtmlWidget) {
        let useButton: HTMLButtonElement;
        blobTab.createParagraph(
            "Select a blob resource from the database or upload a new blob resource. A blob URL will be generated for playback.");
        blobTab.createElement("table", element => {
            let table = element as HTMLTableElement;
            table.innerHTML = `
<thead>
    <tr>
        <th>Select</th>
        <th>Name</th>
        <th>File Name</th>
        <th>File Type</th>
        <th>MIME Type</th>
        <th>Action</th>
    </tr>
</thead>
`;
            let body = table.createTBody();
            this.resourceManager.getAllBlobResources().then(blobs => {
                for (let blobResource of blobs) {
                    this.addResourceToTable(body, blobResource);
                }
                blobTab.createElement("div",
                    uploadFileSection => {
                        uploadFileSection.classList.add("group-box");
                        let form = new HtmlWidget("form", "");
                        form.element.classList.add("form-content");
                        form.shouldAppendChild = true;
                        uploadFileSection.appendChild(form.element);
                        let formBuilder = new HtmlWidgetFormBuilder(form);
                        let fileInput: any;
                        formBuilder.addTextInput("Blob Name", "blobNameInput", true);
                        formBuilder.addFileInput("File to Upload",
                                "fileInputBlob",
                                true,
                                element => {
                                    let fileElement = element as HTMLInputElement;
                                    fileElement.accept = ".m4a";
                                    fileInput = element;
                                })
                            .addSelect("File Type",
                                "fileTypeSelect",
                                true,
                                [{ value: "song", text: "Song" }])
                            .addElement("div",
                                div => {
                                    div.classList.add("btn-group-horizontal");
                                    let button = document.createElement("button");
                                    div.appendChild(button);
                                    button.classList.add("btn");
                                    button.textContent = "Upload";
                                    button.addEventListener("click",
                                        async (evt: UIEvent) => {
                                            evt.preventDefault();
                                            if (!(form.element as HTMLFormElement).checkValidity()) {
                                                alert("Validation failed: Please check form before submitting.");
                                                return;
                                            }
                                            //Begin work.
                                            button.disabled = true;
                                            useButton.disabled = true;
                                            button.textContent = "Working...";
                                            let file = fileInput.files[0] as File;
                                            let resource = new Resource();
                                            resource.resourceName = (form.element.querySelector("#blobNameInput") as
                                                HTMLInputElement).value;
                                            resource.resourcePurpose = ResourcePurpose.Song;
                                            resource.resourceType = ResourceType.Blob;
                                            let blobResource: IBlobResource = {
                                                fileName: file.name,
                                                blobData: file
                                            }
                                            resource.resourceBody = blobResource;
                                            let newResource = await this.resourceManager.addResource(resource);
                                            resource = null;
                                            this.addResourceToTable(body, newResource);
                                            button.disabled = false;
                                            useButton.disabled = false;
                                            button.textContent = "Upload";
                                        });
                                    useButton = document.createElement("button");
                                    div.appendChild(useButton);
                                    useButton.classList.add("btn");
                                    useButton.textContent = "Use Selected";
                                    useButton.addEventListener("click",
                                        async (evt) => {
                                            evt.preventDefault();
                                            //No blob selected
                                            if (this.selectedResourceId === -1) {
                                                alert("You must select a blob from the table.");
                                                return;
                                            }
                                            if (this.valueSelected != null) {
                                                let resource =
                                                    await this.resourceManager.getResource(this.selectedResourceId);
                                                this.valueSelected(ResourceType.Blob,
                                                    this.selectedResourceId,
                                                    resource.resourceName);
                                            }
                                            this.close();
                                        });
                                });
                    });
            });
        });
    }
    private createCloseButton() {
        this.modalFooter.createElement("button",
            button => {
                button.classList.add("btn");
                button.textContent = "Exit";
                button.addEventListener("click", click => this.close());
            });
    }
}