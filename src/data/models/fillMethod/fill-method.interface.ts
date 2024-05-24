import { Question } from "../question/question.interface";

export interface FillMethod {
    id: number;
    name: string;
    hint: string;
    questions: Question[];
}
