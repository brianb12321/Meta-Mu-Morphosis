import { inject, injectable } from "tsyringe";
import { ILogger } from "../../core/logging/ILogger";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TLogger } from "../../globalSymbols";

@injectable()
export class NavigationBarViewModel extends BaseViewModel {
    constructor(@inject(TLogger) public logger: ILogger) {
        super();
    }
}