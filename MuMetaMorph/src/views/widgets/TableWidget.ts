import { Widget } from "../../core/render/Widget";

export class TableWidget extends Widget {
    public tableHeadingRow: TableRowWidget;
    constructor() {
        super();
        this.renderBody = document.createElement("table");
    }
    shouldRender(): boolean {
        return true;
    }
    addRow(): TableRowWidget {
        let tableRow = new TableRowWidget();
        tableRow.parentWidget = this;
        this.widgets.push(tableRow);
        return tableRow;
    }
    addHeadingRow(rowName: string) {
        if (this.tableHeadingRow == null) {
            this.tableHeadingRow = new TableRowWidget();
            this.widgets.push(this.tableHeadingRow);
        }

        this.tableHeadingRow.parentWidget = this;
        this.tableHeadingRow.addRowHeading(rowName);
    }
}

export class TableRowWidget extends Widget {
    shouldRender(): boolean {
        return true;
    }
    constructor() {
        super();
        this.renderBody = document.createElement("tr");
    }
    addRowDefinition(value: string) {
        let rowDefinition = new TableRowDefinitionWidget();
        rowDefinition.parentWidget = this;
        rowDefinition.renderBody.textContent = value;
        this.widgets.push(rowDefinition);
    }
    addRowHeading(value: string) {
        let rowHeading = new TableRowHeadingWidget();
        rowHeading.parentWidget = this;
        rowHeading.renderBody.textContent = value;
        this.widgets.push(rowHeading);
    }
}
export class TableRowDefinitionWidget extends Widget {
    constructor() {
        super();
        this.renderBody = document.createElement("td");
    }
    shouldRender(): boolean {
        return true;
    }
}
export class TableRowHeadingWidget extends Widget {
    constructor() {
        super();
        this.renderBody = document.createElement("th");
    }
    shouldRender(): boolean {
        return true;
    }
}