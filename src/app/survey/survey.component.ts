import { Component, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Measure } from '../../data/models/measure/measure.interface';
import { Form } from '../../data/models/form/form.interface';
import { FormService } from '../../services/formService/form.service';
import { MeasureService } from '../../services/measureService/measure.service';
import { FillMethodService } from '../../services/fillMethodService/fill-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FillMethod } from '../../data/models/fillMethod/fill-method.interface';
import { Criteria } from '../../data/models/criteria/criteria.interface';
import { AnswerPost } from '../../data/requestModels/answer-post.interface';
import { AnswerService } from '../../services/answerService/answer.service';
import { AnswerPut } from '../../data/requestModels/answer-put.interface';
import { SurveyService } from '../../services/surveyService/survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css'
})
export class SurveyComponent {
  public measures: Measure[];
  public fillMethods: FillMethod[];
  public idParam: string | null = null;
  public formName: string;
  public isAdminPage: boolean;
  
  public form!: Form;
  public formGroup: FormGroup;

  constructor(private formSerive: FormService, private answerService: AnswerService, private surveyService: SurveyService, public router: Router, 
              private route:ActivatedRoute, private formBuilder : FormBuilder){
    this.measures = new Array<Measure>();
    this.fillMethods = new Array<FillMethod>();
    this.formName = "";
    this.isAdminPage = false;
    this.formGroup = this.formBuilder.group({
      Id : new FormControl("", Validators.required),
      Name: new FormControl("", Validators.required),
      Criterias: new FormArray([
        this.formBuilder.group({
          Id : new FormControl("", Validators.required),
          Name : new FormControl("", Validators.required),
          Sequence: new FormControl(1, Validators.required),
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
    this.isAdminPage = this.router.url.startsWith("/admin")
    this.route.params.subscribe(params => {
      this.idParam = params["id"];
      if (this.idParam == "create") {
            
      } 
      else if (!Number.isNaN(this.idParam)){
          this.refreshMySurveyById(Number(this.idParam))
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  private refreshMySurveyById(id: number): void{
    this.surveyService.getMyById(id)
      .subscribe({
        next: (data) => {
          this.form = data;
          this.formName = this.form.name;
          this.setFormGroup(this.form);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  private setFormGroup(form: Form){
    this.formGroup = this.formBuilder.group({
      Id: new FormControl(form.id),
      Name: new FormControl(form.name),
      Criterias: this.setCriterias(this.form.criterias),
    })
  }

  private setCriterias(criterias: Criteria[]){
    let arr = new FormArray<any>([]);
    criterias.forEach(c =>{
      arr.push(this.formBuilder.group({
        Id : new FormControl(c.id),
        Name : new FormControl(c.name),
        Sequence: new FormControl(c.sequence),
        Questions: this.setQuestions(c),
      }))
    })
    return arr;
  }

  private setQuestions(criteria: Criteria): FormArray<any>{
    let arr = new FormArray<any>([]);
    criteria.questions.forEach(question =>{
      arr.push(this.formBuilder.group({
        Id: new FormControl(question.id),
        Name: new FormControl(question.name),
        Hint: new FormControl(question.hint),
        CriteriaId: new FormControl(question.criteriaId),
        MeasureName: new FormControl(question.measure?.name),
        SurveyId: this.idParam,
        Answer: new FormControl(question.answers.find(a => a.questionId == question.id)?.text, Validators.required),
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
    let questionData: AnswerPut[] = new Array<AnswerPut>;
    this.criteriasFormArr.controls.forEach(criteriaControl => {
      const questionsArray = (criteriaControl as FormGroup).get('Questions') as FormArray;

      questionsArray.controls.forEach(questionControl => {
        questionData.push({
          id: null,
          surveyId: Number(this.idParam),
          text: (questionControl.get('Answer')!.value == null ? null : questionControl.get('Answer')!.value),
          questionId: questionControl.get('Id')!.value
        });
      });
      
    });
    this.answerService.updateMyAll(questionData).subscribe({
      next: (data) => {
      },
      error: (error) =>{
        console.log(error);
      }
    });
  }
  public send(): void{
    this.surveyService.submitForEvaluation(this.form.id).subscribe({
      next: (data) =>{
        this.router.navigate(["surveys"]);
      },
      error(err) {
        console.log(err);
      },
    })
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
