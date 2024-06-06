export interface QuestionPut {
    id: number;
    name: string;
    hint: string;
    criteriaId: number;
    sequence: number;
    formula: string;
    measureId: number;
    hidden: boolean;
    fillMethodId: number;
}
