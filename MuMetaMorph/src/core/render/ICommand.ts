//Represents an action requested by a view to the view-model.
export interface ICommand {
    shouldRun(): boolean;
    run(args: any): Promise<void>;
}