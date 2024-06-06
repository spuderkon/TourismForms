
import { Answer } from "../answer/answer.interface";
import { City } from "../city/city.interface";
import { Form } from "../form/form.interface";
import { Municipality } from "../municipality/municipality.interface";

export interface Survey {
    id: number;
    formId: number;
    appointmentDate: string;
    startDate: string;
    completionDate: string;
    endDate: string;
    completed: boolean;
    municipality: string;
    municipalityId: number;
    city: string;
    cityId: number;
    comment: string;
    answers: Answer[];
    cityNavigation: City;
    form: Form;
    municipalityNavigation: Municipality;
}
