//Will be executed when the application gets bootstrapped. Any configuration initialization setup should be executed in the initialize method.
export interface IStartupItem {
    initialize(): Promise<void>;
}