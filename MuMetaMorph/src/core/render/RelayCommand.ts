import { ICommand } from "./ICommand";

//A general-purpose command meant for short operations.
export class RelayCommand implements ICommand {
    constructor(
        public shouldRun: () => boolean,
        public run: (args: any) => Promise<void>) {
    }
}