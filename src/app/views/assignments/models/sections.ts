import { questionsVM } from "./questionsVM";

export class Section{
    id : string ="";
    durationInMinutes : number = 0;
    name : string = "";
    testId : string = "";
    questions : questionsVM[];
}