﻿//Any component that can be rendered onto a view.
export abstract class Widget {
    private _parentWidget: Widget;
    private _alreadyRendered: boolean = false;
    public renderOnce: boolean = false;
    public set parentWidget(value: Widget) {
        this._parentWidget = value;
    }
    public renderBody: Element;
    public widgets: Widget[];
    constructor() {
        this.widgets = [];
    }
    //Gets executed when the render method has been invoked.
    public onRender: () => void;
    abstract shouldRender(): boolean;
    clear(): void {
        this.renderBody.innerHTML = "";
    }
    async render(): Promise<void> {
        if (!this._alreadyRendered && this.shouldRender()) {
            if (this.onRender != null) {
                this.onRender();
            }
            for (let subWidget of this.widgets) {
                await subWidget.render();
                this.renderBody.appendChild(subWidget.renderBody);
            }
        }
        if (this.renderOnce) {
            if (!this._alreadyRendered) this._alreadyRendered = true;
        }
    }
}