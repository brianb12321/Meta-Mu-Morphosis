import { injectable, inject } from "tsyringe";
import { ILogger } from "../../core/logging/ILogger";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { ICommand } from "../../core/render/ICommand";
import { RelayCommand } from "../../core/render/RelayCommand";
import { TLogger } from "../../globalSymbols";

@injectable()
export class MainViewModel extends BaseViewModel {
    public switchViewCommand: ICommand;
    public onViewChanged: (name: string) => void;
    constructor(@inject(TLogger) public logger: ILogger) {
        super();
        this.switchViewCommand = new RelayCommand(() => true,
            async (args) => {
                this.onViewChanged(args);
            });
    }
}