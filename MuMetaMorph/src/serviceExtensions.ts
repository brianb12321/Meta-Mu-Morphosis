import { container, InjectionToken } from "tsyringe";
import { IApplication } from "./core/bootstrapper/IApplication";
import { TThemeManager, TPageNavigator, TNavBar, TStartupItem, TPlugins } from "./globalSymbols";
import { DefaultThemeManager } from "./core/render/theme/DefaultThemeManager";
import { ThemeManagerStartupItem } from "./core/render/theme/ThemeManagerStartupItem";
import { MainViewModel } from "./views/viewModels/MainViewModel";
import { PluginBase } from "./core/pluginSystem/PluginBase";

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
    addPlugin(plugin: PluginBase): ServiceExtensions {
        container.registerInstance(TPlugins, plugin);
        return this;
    }
}