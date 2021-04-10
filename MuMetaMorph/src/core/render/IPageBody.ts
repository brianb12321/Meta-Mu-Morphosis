//Represents one page render-able to the screen. Each page will handle event listening.
export interface IPageBody {
	renderBody(renderBody: Element): void;
}