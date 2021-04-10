import { Inject, Injectable } from "container-ioc";
import { IConfigurationManager } from "../../configuration/IConfigurationManager";
import { TConfigurationManager, TLogger } from "../../globalSymbols";
import { ILogger } from "../../logging/ILogger";

@Injectable()
export class DefaultThemeManager implements IThemeManager {
    THEME_CONFIG_NAME = "Theme";
    stylesheetRootDir: string;
    private themeConfig: any = {};
    constructor(@Inject(TConfigurationManager) private configManager: IConfigurationManager, @Inject(TLogger) private logger: ILogger) {

    }
    async initialize(): Promise<void> {
        //Attempt to load configuration options related to themes.
        if (await this.configManager.rootExists(this.THEME_CONFIG_NAME)) {
            this.themeConfig = await this.configManager.loadRootConfigObject(this.THEME_CONFIG_NAME);
            this.stylesheetRootDir = this.themeConfig.stylesheetRootDir;
        } else await this.setupConfig();
    }
    private async setupConfig() {
        this.themeConfig.selectedStylesheet = "site.css";
        this.themeConfig.stylesheetRootDir = "/styles";
        await this.configManager.saveRootConfigObject(this.THEME_CONFIG_NAME, this.themeConfig);
        this.stylesheetRootDir = this.themeConfig.stylesheetRootDir;
    }
    getSelectedStylesheet(): string {
        //We are going to cheat a little by concatenating paths. You would normally use a path combine method.
        let themePath = this.stylesheetRootDir + "/" + this.themeConfig.selectedStylesheet;
        this.logger.log(`[Theme Manager]: Applying theme at path: ${themePath}`);
        return themePath;
    }
}