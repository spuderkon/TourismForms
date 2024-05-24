import { Question } from "../question/question.interface";
import { Survey } from "../survey/survey.interface";

export interface Answer {
    id: number;
    surveyId: number;
    text: string;
    score: number;
    questionId: number;
    question: Question;
    survey: Survey;
}
