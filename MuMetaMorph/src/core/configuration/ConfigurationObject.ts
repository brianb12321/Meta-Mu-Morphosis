import { IConfiguration } from "./IConfiguration";

//Root class for the global configuration table.
export class ConfigurationObject {
    Id?: number;
    Name: string;
    Value: any;
    toObject<TObject extends IConfiguration>(): TObject {
        return this.Value as TObject;
    }
}