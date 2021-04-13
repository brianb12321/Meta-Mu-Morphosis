import { injectable } from "tsyringe";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { ICommand } from "../../core/render/ICommand";
import { RelayCommand } from "../../core/render/RelayCommand";

@injectable()
export class PlayerViewModel extends BaseViewModel {
    public togglePlayer: ICommand;
    public togglePlayerEvent: Function;
    constructor() {
        super();
        this.togglePlayer = new RelayCommand(() => true, () => this.togglePlayerEvent());
    }
}