///Configure global application options here.
import "reflect-metadata";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { addViewModels } from "./viewModelCollection";
import { TestPlugin } from "./plugins/TestPlugin";
import { HtmlPlugin } from "./plugins/HTMLPlugin/HtmlPlugin";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .useDatabase(null)
    .addConfigurationManager(null)
    .addSongManager(null)
    .addResourceManager(null)
    .configureContainer((extensions) => {
        extensions.addThemeManager();
        addViewModels();
        extensions.addPlugin(new TestPlugin("TestPlugin"));
        extensions.addPlugin(new HtmlPlugin());
    });

application.run("Home");