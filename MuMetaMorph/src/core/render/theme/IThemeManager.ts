import { IStartupItem } from "../../bootstrapper/IStartupItem";

//Selects a theme, find its corresponding stylesheets and loads it.
export interface IThemeManager {
    initialize(): Promise<void>;
    getStylesheetRootDir(): string;
    getSelectedStylesheet(): string;
}