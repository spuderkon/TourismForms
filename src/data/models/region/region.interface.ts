import { Municipality } from "../municipality/municipality.interface";

export interface Region {
    id: number;
    name: string;
    municipalities: Municipality[];
}
