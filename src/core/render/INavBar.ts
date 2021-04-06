//Render component for the navigation bar. Will be rendered once.
export interface INavBar {
    renderNavBar(renderBody: Element): Promise<void>;
};