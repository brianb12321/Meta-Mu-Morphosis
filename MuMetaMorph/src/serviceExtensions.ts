import { container, InjectionToken } from "tsyringe";
import { IApplication } from "./core/bootstrapper/IApplication";
import { TThemeManager, TPageNavigator, TNavBar, TStartupItem } from "./globalSymbols";
import { DefaultThemeManager } from "./core/render/theme/DefaultThemeManager";
import { ThemeManagerStartupItem } from "./core/render/theme/ThemeManagerStartupItem";
import { MainViewModel } from "./views/viewModels/MainViewModel";

//Add any additional methods here that can be invoked in main.ts.

export class ServiceExtensions {
    private application: IApplication;
    constructor(application: IApplication) {
        this.application = application;
    }
    addThemeManager(): ServiceExtensions {
        container.registerSingleton(TThemeManager, DefaultThemeManager);
        container.registerType(TStartupItem, ThemeManagerStartupItem);
        return this;
    }
}