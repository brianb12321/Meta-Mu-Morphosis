///Configure global application options here.
import "reflect-metadata";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { addViewModels } from "./viewModelCollection";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .useDatabase(null)
    .addConfigurationManager(null)
    .addSongManager(null)
    .configureContainer((extensions) => {
        extensions.addThemeManager();
        addViewModels();
    });

application.run("Home");