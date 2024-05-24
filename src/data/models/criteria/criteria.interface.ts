import { Form } from "../form/form.interface";
import { Question } from "../question/question.interface";

export interface Criteria {
    id: number;
    name: string;
    formId: number;
    sequence: number;
    form: Form;
    questions: Question[];
}
