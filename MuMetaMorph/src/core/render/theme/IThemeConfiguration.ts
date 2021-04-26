import { IConfiguration } from "../../configuration/IConfiguration";
import { ITheme } from "./ITheme";

//Configuration options for the theme manager.
export interface IThemeConfiguration extends IConfiguration {
    StylesheetRootDir: string;
    DefaultThemeName: string;
    Themes: ITheme[];
}