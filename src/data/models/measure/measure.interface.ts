import { Question } from "../question/question.interface";

export interface Measure {
    id: number;
    name: string;
    questions: Question[];
}
