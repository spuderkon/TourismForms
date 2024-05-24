import { Component, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Measure } from '../../../data/models/measure/measure.interface';
import { Form } from '../../../data/models/form/form.interface';
import { FormService } from '../../../services/formService/form.service';
import { MeasureService } from '../../../services/measureService/measure.service';
import { FillMethodService } from '../../../services/fillMethodService/fill-method.service';
import { ActivatedRoute } from '@angular/router';
import { FillMethod } from '../../../data/models/fillMethod/fill-method.interface';
import { Criteria } from '../../../data/models/criteria/criteria.interface';
import { AnswerPost } from '../../../data/models/requestModels/AnswerPost/answerPost.interface';
import { AnswerService } from '../../../services/answerService/answer.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css'
})
export class SurveyComponent {
  public measures: Measure[];
  public fillMethods: FillMethod[];
  public idParam: string | null = null;
  
  public form!: Form;
  public formGroup: FormGroup;

  constructor(private formSerive: FormService, private answerService: AnswerService, private route:ActivatedRoute, private formBuilder : FormBuilder){
    this.measures = new Array<Measure>();
    this.fillMethods = new Array<FillMethod>();
    this.formGroup = this.formBuilder.group({
      Id : new FormControl("", Validators.required),
      Name: new FormControl("", Validators.required),
      Criterias: new FormArray([
        this.formBuilder.group({
          Id : new FormControl("", Validators.required),
          Name : new FormControl("", Validators.required),
          Sequence: new FormControl("", Validators.required),
          Questions : new FormArray([
            this.formBuilder.group({
              Id: new FormControl("", Validators.required),
              Name: new FormControl("", Validators.required),
              Hint: new FormControl("", Validators.required),
              CriteriaId: new FormControl("", Validators.required),
              MeasureName: new FormControl("", Validators.required),
              SurveyId: 0,
              Answer: new FormControl("qwe", Validators.required),
            })
          ])
        })
      ]),
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idParam = params["id"];
      if (this.idParam == "create") {
            
      } 
      else if (!Number.isNaN(this.idParam)){
          this.refreshFormById(Number(this.idParam))
      }
      else{
        
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  private refreshFormById(id: number): void{
    this.formSerive.getById(id)
      .subscribe({
        next: (data) => {
          this.form = data;
          this.setFormGroup(this.form);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  private async setFormGroup(form: Form){
    this.formGroup = this.formBuilder.group({
      Id: new FormControl(form.id, Validators.required),
      Name: new FormControl(form.name, Validators.required),
      Criterias: this.setCriterias(this.form.criterias),
    })
  }

  private setCriterias(criterias: Criteria[]){
    let arr = new FormArray<any>([]);
    criterias.forEach(c =>{
      arr.push(this.formBuilder.group({
        Id : new FormControl(c.id, Validators.required),
        Name : new FormControl(c.name, Validators.required),
        Sequence: new FormControl(this.getLetterByNumber(c.sequence), Validators.required),
        Questions: this.setQuestions(c),
      }))
    })
    return arr;
  }

  private setQuestions(criteria: Criteria): FormArray<any>{
    let arr = new FormArray<any>([]);
    criteria.questions.forEach(q =>{
      arr.push(this.formBuilder.group({
        Id: new FormControl(q.id, Validators.required),
        Name: new FormControl(q.name, Validators.required),
        Hint: new FormControl(q.hint, Validators.required),
        CriteriaId: new FormControl(q.criteriaId, Validators.required),
        MeasureName: new FormControl(q.measure?.name, Validators.required),
        SurveyId: this.idParam,
        Answer: new FormControl("", Validators.required),
      }))
    })
    return arr;
  }

  public get criteriasFormArr() : FormArray {
    return this.formGroup.get('Criterias') as FormArray;
  }

  public questionsFormArr(id: number): FormArray {
    return (this.formGroup.get('Criterias') as FormArray).at(id).get('Questions') as FormArray
  }

  public saveAnswers(): void{
    let questionData: AnswerPost[] = new Array<AnswerPost>;
    this.criteriasFormArr.controls.forEach(criteriaControl => {
      const questionsArray = (criteriaControl as FormGroup).get('Questions') as FormArray;

      questionsArray.controls.forEach(questionControl => {
        questionData.push({
          surveyId: 1,
          text: questionControl.get('Answer')!.value,
          questionId: questionControl.get('Id')!.value
        });
      });
      
    });
    this.answerService.saveMyAll(questionData).subscribe({
      next: (data) => {
      },
      error: (error) =>{
        console.log(error);
      }
    });
  }

  public getLetterByNumber(number: any) {
    if (number < 1 || number > 26) {
      throw new Error('Число должно быть в диапазоне от 1 до 26' + "=" + number);
  }
  const charCodeOfA = 'A'.charCodeAt(0);
  const charCodeOfGivenLetter = charCodeOfA + (number - 1);
  const letter = String.fromCharCode(charCodeOfGivenLetter);
  return letter;
  }
}
