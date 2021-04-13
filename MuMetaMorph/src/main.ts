///Configure global application options here.
import "reflect-metadata";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { IndexDbConfigurationManager } from "./core/configuration/indexDb/IndexDbConfigurationManager";
import { addViewModels } from "./viewModelCollection";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .addConfigurationManager(() => new IndexDbConfigurationManager(logger))
    .configureContainer((extensions) => {
        extensions.addThemeManager();
        addViewModels();
    });

application.run("Home");