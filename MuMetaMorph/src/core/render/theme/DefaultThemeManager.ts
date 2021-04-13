import { inject, injectable } from "tsyringe";
import { IConfigurationManager } from "../../configuration/IConfigurationManager";
import { TConfigManager, TLogger } from "../../../globalSymbols";
import { ILogger } from "../../logging/ILogger";
import { ITheme } from "./ITheme";
import { IThemeConfiguration } from "./IThemeConfiguration";
import { IThemeManager } from "./IThemeManager";

@injectable()
export class DefaultThemeManager implements IThemeManager {
    THEME_CONFIG_NAME = "Theme";
    private themeConfig: IThemeConfiguration;
    private defaultTheme: ITheme;
    constructor(@inject(TConfigManager) private configManager: IConfigurationManager, @inject(TLogger) private logger: ILogger) {

    }
    async initialize(): Promise<void> {
        //Theme configuration does not exist.
        if (!await this.configManager.configurationExists(this.THEME_CONFIG_NAME)) {
            this.logger.log("[Theme Manager]: Theme configuration object does not exist.");
            let configObject: IThemeConfiguration = {
                StylesheetRootDir: "/styles",
                DefaultThemeName: "AquaBlue",
                Themes: [
                    {
                        Name: "AquaBlue",
                        Stylesheet: "site.css"
                    }
                ]
            };
            await this.configManager.saveConfiguration(this.THEME_CONFIG_NAME, configObject);
        }
        this.logger.log("[Theme Manager]: Loading theme configuration options.");
        this.themeConfig = await this.configManager.getConfiguration<IThemeConfiguration>(this.THEME_CONFIG_NAME);
        //Attempt to load configuration options related to themes.
        this.logger.log(`[Theme Manager]: ${this.themeConfig.DefaultThemeName} theme will be used.`);
        this.defaultTheme = this.themeConfig.Themes.find(t => t.Name == this.themeConfig.DefaultThemeName);
    }
    getSelectedStylesheet(): string {
        //We are going to cheat a little by concatenating paths. You would normally use a path combine method.
        let themePath = this.getStylesheetRootDir() + "/" + this.defaultTheme.Stylesheet;
        this.logger.log(`[Theme Manager]: Applying theme at path: ${themePath}`);
        return themePath;
    }
    getStylesheetRootDir(): string {
        return this.themeConfig.StylesheetRootDir;
    }
}