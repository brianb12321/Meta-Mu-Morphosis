//Selects a theme, find its corresponding stylesheets and loads it.
interface IThemeManager {
    stylesheetRootDir: string;
    getSelectedStylesheet(): string;
}