import { container, injectable } from "tsyringe"
import { IApplication } from "./IApplication";
import { ILogger } from "../logging/ILogger";
import { IConfigurationManager } from "../configuration/IConfigurationManager";
import { IndexDbConfigurationManager } from "../configuration/indexDb/IndexDbConfigurationManager";
import { IStartupItem } from "./IStartupItem";
import { IThemeManager } from "../render/theme/IThemeManager";
import { TLogger, TConfigManager, TPageNavigator, TNavBar, TThemeManager, TStartupItem, TSongManager, TBlobResourceManager } from "../../globalSymbols";
import { ServiceExtensions } from "../../serviceExtensions";
import { MainView } from "../../views/mainView";
import { ISongManager } from "../music/ISongManager";
import { SongManager } from "../music/SongManager";
import { MMMConfigurationDatabase } from "../configuration/indexDb/MMMConfigurationDatabase";
import { BlobResourceManager } from "../resourceSystem/BlobResourceManager";
import { IBlobResourceManager } from "../resourceSystem/IBlobResourceManager";

@injectable()
export class DefaultApplication implements IApplication {
    private logger: ILogger;
    private configurationManager: IConfigurationManager;
    private blobResourceManager: IBlobResourceManager;
    private database: MMMConfigurationDatabase;
    private songManager: ISongManager;
    constructor() {
        
    }
    configureContainer(containerBuilder: (serviceExtensions: ServiceExtensions) => void): IApplication {
        if (containerBuilder != null) {
            containerBuilder(new ServiceExtensions(this));
        }
        container.registerInstance(TLogger, this.logger);
        container.registerInstance(TConfigManager, this.configurationManager);
        container.registerInstance(TSongManager, this.songManager);
        container.registerInstance(TBlobResourceManager, this.blobResourceManager);
        return this;
    }
    addLogger(logger: ILogger): IApplication {
        this.logger = logger;
        return this;
    }
    useDatabase(databaseBuilder: Function): IApplication {
        if (databaseBuilder != null) {
            this.database = databaseBuilder();
        } else {
            this.database = new MMMConfigurationDatabase(this.logger);
        }
        return this;
    }
    addSongManager(songManagerBuilder: Function): IApplication {
        if (songManagerBuilder != null) {
            this.songManager = songManagerBuilder();
        } else {
            this.songManager = new SongManager(this.database);
        }
        return this;
    }
    addConfigurationManager(configBuilder: Function): IApplication {
        if (configBuilder != null) {
            this.configurationManager = configBuilder();
        } else {
            this.configurationManager = new IndexDbConfigurationManager(this.logger, this.database);
        }
        
        return this;
    }
    addBlobResourceManager(blobResourceManagerBuilder: Function): IApplication {
        if (blobResourceManagerBuilder != null) {
            this.blobResourceManager = blobResourceManagerBuilder();
        } else {
            this.blobResourceManager = new BlobResourceManager(this.logger, this.database);
        }

        return this;
    }
    async initializeStartupItems() {
        this.logger.log("Initializing startup items...");
        for (let startupItem of container.resolveAll<IStartupItem>(TStartupItem)) {
            await startupItem.initialize();
        }
    }
    async run(indexPageToken: any) {
        await this.initializeStartupItems();
        await this.loadTheme();
        let body = document.querySelector("#render-body");
        let view: MainView = new MainView();
        view.renderBody = body;
        view.afterConstruction();
        await view.render();
        this.logger.log("Application started.");
    }
    private async loadTheme() {
        this.logger.log("Loading css theme...");
        let themeManager: IThemeManager = container.resolve(TThemeManager);
        let fileRef = document.createElement("link");
        fileRef.rel = "stylesheet";
        fileRef.type = "text/css";
        fileRef.href = themeManager.getSelectedStylesheet();
        document.getElementsByTagName("head")[0].appendChild(fileRef);
        this.logger.log("Theme loaded.");
    }
}