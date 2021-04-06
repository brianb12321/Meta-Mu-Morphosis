import { Container } from "container-ioc";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { IndexPage } from "./pages/indexPage";
import { TNavBar, TPageNavigator, TThemeManager } from "./core/globalSymbols";
import { DefaultThemeManager } from "./core/render/theme/DefaultThemeManager";
import { PageNavigator } from "./core/render/PageNavigator";
import { NavBar } from "./pages/NavBar";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .configureContainer(() => {
        let container = new Container();
        container.register([
            { token: TThemeManager, useClass: DefaultThemeManager },
            { token: TNavBar, useClass: NavBar },
            { token: TPageNavigator, useClass: PageNavigator },
            { token: "IPageBody-Index", useClass: IndexPage }
        ]);
        return container;
    });

application.run("IPage-IndexPage");