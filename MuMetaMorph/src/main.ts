import "reflect-metadata";
import { container } from "tsyringe";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { IndexPage } from "./pages/indexPage";
import { TNavBar, TPageNavigator, TStartupItem, TThemeManager } from "./core/globalSymbols";
import { DefaultThemeManager } from "./core/render/theme/DefaultThemeManager";
import { PageNavigator } from "./core/render/PageNavigator";
import { NavBar } from "./pages/NavBar";
import { MusicPage } from "./pages/MusicPage";
import { IndexDbConfigurationManager } from "./core/configuration/indexDb/IndexDbConfigurationManager";
import { ThemeManagerStartupItem } from "./core/render/theme/ThemeManagerStartupItem";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .addConfigurationManager(() => new IndexDbConfigurationManager(logger))
    .configureContainer(() => {
        container.registerSingleton(TThemeManager, DefaultThemeManager);
        container.registerType(TNavBar, NavBar);
        container.registerSingleton(TPageNavigator, PageNavigator);
        container.registerType("IPageBody-Home", IndexPage);
        container.registerType("IPageBody-Music", MusicPage);
        container.registerType(TStartupItem, ThemeManagerStartupItem);
    });

application.run("Home");