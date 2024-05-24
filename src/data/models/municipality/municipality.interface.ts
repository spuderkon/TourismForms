import { City } from "../city/city.interface";
import { Region } from "../region/region.interface";
import { Survey } from "../survey/survey.interface";

export interface Municipality {
    id: number;
    name: string;
    regionId: number;
    login: string | null;
    password: string | null;
    email: string | null;
    isAdmin: boolean | null;
    cities: City[];
    region: Region;
    surveys: Survey[];
}
