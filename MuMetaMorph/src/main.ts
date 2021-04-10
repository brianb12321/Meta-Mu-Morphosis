import { Container, LifeTime } from "container-ioc";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { IndexPage } from "./pages/indexPage";
import { TNavBar, TPageNavigator, TThemeManager } from "./core/globalSymbols";
import { DefaultThemeManager } from "./core/render/theme/DefaultThemeManager";
import { PageNavigator } from "./core/render/PageNavigator";
import { NavBar } from "./pages/NavBar";
import { MusicPage } from "./pages/MusicPage";
import { IndexDbConfigurationManager } from "./core/configuration/indexDb/IndexDbConfigurationManager";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .addConfigurationManager(() => new IndexDbConfigurationManager(logger))
    .configureContainer(() => {
        let container = new Container();
        container.register([
            { token: TThemeManager, useClass: DefaultThemeManager },
            { token: TNavBar, useClass: NavBar },
            { token: TPageNavigator, useClass: PageNavigator },
            { token: "IPageBody-Home", useClass: IndexPage, lifeTime: LifeTime.PerRequest },
            { token: "IPageBody-Music", useClass: MusicPage, lifeTime: LifeTime.PerRequest },
        ]);
        return container;
    });

application.run("Home");