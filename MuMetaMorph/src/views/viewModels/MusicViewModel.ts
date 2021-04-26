import { inject, injectable } from "tsyringe";
import { ILogger } from "../../core/logging/ILogger";
import { ISongManager } from "../../core/music/ISongManager";
import { BaseViewModel } from "../../core/render/BaseViewModel";
import { TLogger, TSongManager } from "../../globalSymbols";

@injectable()
export class MusicViewModel extends BaseViewModel {
    constructor(@inject(TLogger) public logger: ILogger, @inject(TSongManager) public songManager: ISongManager) {
        super();
    }
}