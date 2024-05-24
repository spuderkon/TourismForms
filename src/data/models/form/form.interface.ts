import { Criteria } from "../criteria/criteria.interface";
import { Survey } from "../survey/survey.interface";

export interface Form {
    id: number;
    name: string;
    creationDate: string;
    modifiedDate: string;
    criterias: Criteria[];
    surveys: Survey[];
}
