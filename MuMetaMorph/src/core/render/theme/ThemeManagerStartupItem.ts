import { inject, injectable } from "tsyringe";
import { IStartupItem } from "../../bootstrapper/IStartupItem";
import { TLogger, TThemeManager } from "../../globalSymbols";
import { ILogger } from "../../logging/ILogger";
import { IThemeManager } from "./IThemeManager";

@injectable()
export class ThemeManagerStartupItem implements IStartupItem {
    constructor(@inject(TThemeManager) private themeManager: IThemeManager, @inject(TLogger) private logger: ILogger) {

    }
    async initialize(): Promise<void> {
        this.logger.log("Initializing theme manager.");
        await this.themeManager.initialize();
    }
}