///Configure global application options here.
import "reflect-metadata";
import { ConsoleLogger } from "./core/logging/ConsoleLogger";
import { DefaultApplication } from "./core/bootstrapper/DefaultApplication";
import { addViewModels } from "./viewModelCollection";
import { TestPlugin } from "./plugins/TestPlugin";

const logger = new ConsoleLogger();
const application = new DefaultApplication()
    .addLogger(logger)
    .useDatabase(null)
    .addConfigurationManager(null)
    .addSongManager(null)
    .configureContainer((extensions) => {
        extensions.addThemeManager();
        addViewModels();
        extensions.addPlugin(new TestPlugin("TestPlugin"));
        extensions.addPlugin(new TestPlugin("Kitty", "Kitty Plugin"));
        extensions.addPlugin(new TestPlugin("MusicForNerds", "Music for Nerds"));
        extensions.addPlugin(new TestPlugin("MuseScore", "MuseScore"));
        extensions.addPlugin(new TestPlugin("Metronome", "Metronome"));
        extensions.addPlugin(new TestPlugin("RandomStuff", "Random Stuff"));
    });

application.run("Home");