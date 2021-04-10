import { INavBar } from "./INavBar";
import { IPageBody } from "./IPageBody";

//Handles navigating between page states.
export interface IPageNavigator {
	navigationBar: INavBar;
	currentPageBody: IPageBody;
	navigationRenderBody: HTMLElement;
	pageBodyRenderBody: HTMLElement;
    navigate(bodyName: string): Promise<void>;
	refreshNavBar(): Promise<void>;
}