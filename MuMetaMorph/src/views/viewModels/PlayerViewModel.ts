import { inject, injectable } from "tsyringe";
import { ISongManager } from "../../core/music/ISongManager";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { ICommand } from "../../core/render/ICommand";
import { RelayCommand } from "../../core/render/RelayCommand";
import { TSongManager } from "../../globalSymbols";

@injectable()
export class PlayerViewModel extends BaseViewModel {
    public togglePlayer: ICommand;
    public togglePlayerEvent: Function;
    constructor(@inject(TSongManager) public songManager: ISongManager) {
        super();
        this.togglePlayer = new RelayCommand(() => true, () => this.togglePlayerEvent());
    }
}