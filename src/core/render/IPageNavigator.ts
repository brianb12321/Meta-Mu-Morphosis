import { INavBar } from "./INavBar";
import { IPageBody } from "./IPageBody";

//Handles navigating between page states.
export interface IPageNavigator {
	navigationBar: INavBar;
	currentPageBody: IPageBody;
    navigate(bodyName: string, renderBody: HTMLElement): Promise<void>;
	refreshNavBar(renderBody: HTMLElement): Promise<void>;
}