import { Answer } from "../answer/answer.interface";
import { Criteria } from "../criteria/criteria.interface";
import { FillMethod } from "../fillMethod/fill-method.interface";
import { Measure } from "../measure/measure.interface";

export interface Question {
    id: number;
    name: string | null;
    hint: string | null;
    criteriaId: number | null;
    sequence: number | null;
    formula: string | null;
    measureId: number | null;
    hidden: boolean | null;
    fillMethodId: number | null;
    answers: Answer[];
    criteria: Criteria | null;
    fillMethod: FillMethod | null;
    measure: Measure | null;
}
