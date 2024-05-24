import { Municipality } from "../municipality/municipality.interface";
import { Survey } from "../survey/survey.interface";

export interface City {
    id: number;
    name: string;
    municipalityId: number;
    municipality: Municipality;
    surveys: Survey[];
}
