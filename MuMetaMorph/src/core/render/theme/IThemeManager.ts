//Selects a theme, find its corresponding stylesheets and loads it.
interface IThemeManager {
    initialize(): Promise<void>;
    stylesheetRootDir: string;
    getSelectedStylesheet(): string;
}