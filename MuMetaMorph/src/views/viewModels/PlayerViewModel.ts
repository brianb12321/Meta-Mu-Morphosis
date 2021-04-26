import { inject, injectable } from "tsyringe";
import { ISongManager } from "../../core/music/ISongManager";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { ICommand } from "../../core/render/ICommand";
import { RelayCommand } from "../../core/render/RelayCommand";
import { IResourceManager } from "../../core/resourceSystem/IResourceManager";
import { TResourceManager, TSongManager, TLogger } from "../../globalSymbols";
import { ILogger } from "../../core/logging/ILogger";

@injectable()
export class PlayerViewModel extends BaseViewModel {
    public togglePlayer: ICommand;
    public togglePlayerEvent: Function;
    constructor(@inject(TLogger) public logger: ILogger, @inject(TSongManager) public songManager: ISongManager, @inject(TResourceManager) public resourceManager: IResourceManager) {
        super();
        this.togglePlayer = new RelayCommand(() => true, () => this.togglePlayerEvent());
    }
}