import { Injectable } from "container-ioc";

@Injectable()
export class DefaultThemeManager implements IThemeManager {
    stylesheetRootDir: string = "/styles"
    getSelectedStylesheet(): string {
        //For now, return site.css.
        //We are going to cheat a little by concatenating paths. You would normally use a path combine method.
        return this.stylesheetRootDir + "/" + "site.css";
    }
}