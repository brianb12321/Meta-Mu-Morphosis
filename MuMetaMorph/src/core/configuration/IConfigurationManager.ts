//Provides facilities for loading and saving configuration objects to the browser's local storage.
export interface IConfigurationManager {
    saveRootConfigObject(rootName: string, rootConfigObject: any): Promise<void>;
    loadRootConfigObject(rootName: string): Promise<any>;
    rootExists(rootName: string): Promise<boolean>;
}