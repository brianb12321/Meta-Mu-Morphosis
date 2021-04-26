import { BaseViewModel } from "./BaseViewModel";
import { Widget } from "./Widget";

//Represents a view that can hold sub-views.
export abstract class View<TViewModel extends BaseViewModel> extends Widget {
	//The bind-ed view-model.
	public dataContext: TViewModel;
    //Executed after the constructor finished loading, but right before the DOM gets rendered.
    public afterConstruction: () => void;
    async render(): Promise<void> {
        await super.render();
        if (this.dataContext != null && this.dataContext.title != null) {
            document.title = this.dataContext.title + " - MMM";
        }
    }
    public forceTitleUpdate() {
        document.title = this.dataContext.title + " - MMM";
    }
}