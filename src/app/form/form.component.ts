import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Criteria } from '../../data/models/criteria/criteria.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MeasureService } from '../../services/measureService/measure.service';
import { FillMethodService } from '../../services/fillMethodService/fill-method.service';
import { Measure } from '../../data/models/measure/measure.interface';
import { FillMethod } from '../../data/models/fillMethod/fill-method.interface';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '../../data/models/form/form.interface';
import { FormService } from '../../services/formService/form.service';
import { Question } from '../../data/models/question/question.interface';

import { FormPut } from '../../data/requestModels/form-put.interface';
import { CriteriaService } from '../../services/criteriaService/criteria.service';

import { QuestionService } from '../../services/questionService/question.service';
import { QuestionPut } from '../../data/requestModels/question-put.interface';
import { CriteriaPut } from '../../data/requestModels/criteria-put.interface';
import { CriteriaPost } from '../../data/requestModels/criteria-post.interface';
import { QuestionPost } from '../../data/requestModels/question-post.interface';
import { FormPost } from '../../data/requestModels/form-post.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit, OnChanges {
  public measures: Measure[];
  public fillMethods: FillMethod[];
  public idParam: string;
  private formulaPattern: string;
  private criteriaSequences: Map<number , string>;
  
  form: Form;
  formGroup: FormGroup;

  constructor(private formSerive: FormService, private measureService: MeasureService, private fillMethodService: FillMethodService, 
              private route:ActivatedRoute, public router: Router,private formBuilder : FormBuilder, private criteriaService: CriteriaService,
              private questionService: QuestionService){
    
    this.measures = new Array<Measure>();
    this.fillMethods = new Array<FillMethod>();
    this.idParam = "";
    this.form = {} as Form;
    this.formGroup = this.formBuilder.group({
      Id : new FormControl("", Validators.required),
          Name: new FormControl("", Validators.required),
          CreationDate: new FormControl("", Validators.required),
          ModifiedDate: new FormControl(""),
          Criterias: new FormArray([])
    });
    this.formulaPattern = "";
    this.criteriaSequences = new Map();
  }

  ngOnInit(): void {
    this.refreshFillMethods();
    this.refreshMeasures();

    this.route.params.subscribe(params => {
      this.idParam = params["id"];
      if (this.idParam == "create") {
            
      } 
      else {
        this.formGroup = this.formBuilder.group({
          Id : new FormControl("", Validators.required),
          Name: new FormControl("", Validators.required),
          CreationDate: new FormControl("", Validators.required),
          ModifiedDate: new FormControl(""),
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
                  Sequence: new FormControl("", Validators.required),
                  Formula: new FormControl("", Validators.required),
                  MeasureId: new FormControl("", Validators.required),
                  Hidden: new FormControl("", Validators.required),
                  FillMethodId: new FormControl("", Validators.required),
                })
              ])
            })
          ]),
        })
          this.refreshFormById(Number(this.idParam))
      }
    });
    
  }

  test(): void{
   this.updatePattern();
  }
  
  private updatePattern(): void{
    this.criteriasFormArr.controls.forEach(control => {
      let criteria = control.value;
      this.criteriaSequences.set(criteria.Sequence, criteria.Questions.length)
    });
    let sequencesAsLetterAsString = "";
    this.criteriaSequences.forEach((value: string, key: number) => {
      let i = 0
      if(value == "0"){
        sequencesAsLetterAsString += `([${this.getLetterByNumber(key)}])`;
        if(i+1 != this.criteriaSequences.size)
        {
          sequencesAsLetterAsString += '|';
        }
      }
      else{
        sequencesAsLetterAsString += `([${this.getLetterByNumber(key)}][1-${value}])`;
        if(i+1 < this.criteriaSequences.size)
        {
            sequencesAsLetterAsString += '|';
        }
      }
      i++;
    });
    sequencesAsLetterAsString = sequencesAsLetterAsString.substring(0,sequencesAsLetterAsString.length-1)
    //^(([А-Я]\d+)|(\d+(\.\d+)?))(([\+\-\*\/]{1})(([А-Я]\d+)|(\d+(\.\d+)?)))*$ |(\d+(\.\d+)?
    this.formulaPattern = `^=((${sequencesAsLetterAsString})|(\\d+(\\.\\d+)?))(([\+\\-\\*\\/]{1})((${sequencesAsLetterAsString})|(\\d+(\\.\\d+)?)))*$`;
    this.criteriasFormArr.controls.forEach((criteriaControl, index) => {
      let criteria = criteriaControl.value;
      this.questionsFormArr(index).controls.forEach((questionControl) => {
        questionControl.get("Formula")!.setValidators([Validators.pattern(this.formulaPattern)]);
      });
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
          this.updatePattern();
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  private setFormGroup(form: Form){
    this.formGroup = this.formBuilder.group({
      Id: new FormControl(form.id, Validators.required),
      Name: new FormControl(form.name, Validators.required),
      CreationDate: new FormControl(form.creationDate, Validators.required),
      ModifiedDate: new FormControl(form.modifiedDate),
      Criterias: this.setCriterias(this.form.criterias),
    })
  }

  private setCriterias(criterias : Criteria[]): FormArray{
    let arr = new FormArray<any>([]);
    criterias.forEach(c => {
      arr.push(this.formBuilder.group({
        Id : [c.id, Validators.required],
        Name : [c.name, Validators.required],
        Sequence: [c.sequence, Validators.required],
        Questions: this.setQuestions(c)
      }))
    })
    return arr;
  }

  private setQuestions(criteria: Criteria): FormArray{
    let arr = new FormArray<any>([]);
    criteria.questions.forEach(q => {
      arr.push(this.formBuilder.group({
        Id: [q.id, Validators.required],
        Name: [q.name, Validators.required],
        Hint: [q.hint, Validators.required],
        CriteriaId: [q.criteriaId, Validators.required],
        Sequence: [q.sequence, Validators.required],
        Formula: new FormControl(q.formula,),
        MeasureId: [q.measureId, Validators.required],                                              
        Hidden: [q.hidden, Validators.required],
        FillMethodId: [q.fillMethodId, Validators.required],
      })) 
    })
    //this.criteriaSequences.set(this.getLetterByNumber(criteria.sequence) ,this.getLetterByNumber(criteria.sequence) + criteria.questions.length);
    return arr;
  }

  

  increaseCriteriaSequence(index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != 0){
      const criteriaTmp = this.criteriasFormArr.at(index)
      this.criteriasFormArr.at(index).value.Sequence = index;
      this.removeCriteriaGroup(index)
      this.criteriasFormArr.insert(index-1, criteriaTmp)
      this.criteriasFormArr.at(index).value.Sequence = index + 1;
    }
  }

  decreaseCriteriaSequence(index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != this.criteriasFormArr.length-1){
      const criteriaTmp = this.criteriasFormArr.at(index+1)
      criteriaTmp.value.Sequence = index+1;
      this.criteriasFormArr.at(index).value.Sequence = index+2;
      this.removeCriteriaGroup(index+1)
      this.criteriasFormArr.insert(index, criteriaTmp)
    }
  }

  public removeCriteriaGroup(index: number) {
    this.criteriasFormArr.removeAt(index);
  }

  increaseQuestionSequence(criteriaId: number, index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != 0){
      const questionTmp = this.questionsFormArr(criteriaId).at(index);
      questionTmp.value.Sequence = index;
      this.removeQuestionGroup(criteriaId, index)
      this.questionsFormArr(criteriaId).insert(index-1, questionTmp)
      this.questionsFormArr(criteriaId).at(index).value.Sequence = index + 1;
    }
  }

  decreaseQuestionSequence(criteriaId: number, index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != this.questionsFormArr(criteriaId).length-1){
      const questionTmp = this.questionsFormArr(criteriaId).at(index+1);
      questionTmp.value.Sequence = index+1;
      this.questionsFormArr(criteriaId).at(index).value.Sequence = index+2;
      this.removeQuestionGroup(criteriaId, index+1)
      this.questionsFormArr(criteriaId).insert(index, questionTmp)
    }
  }

  public removeQuestionGroup(criteriaId: number, index: number) {
    this.questionsFormArr(criteriaId).removeAt(index);
  }

  public get criteriasFormArr() : FormArray {
    return this.formGroup.get('Criterias') as FormArray;
  }

  public questionsFormArr(id: number): FormArray {
    return (this.formGroup.get('Criterias') as FormArray).at(id).get('Questions') as FormArray
  }

  public formulaIsValid(criteriaId: number, questionid: number): boolean {
    const questionFormArr: FormArray = this.questionsFormArr(criteriaId);
    
    return (questionFormArr.at(questionid).get('Formula') as FormControl).hasError('pattern');
  }

  addNewCriteria() {
    this.criteriasFormArr.push(
      this.formBuilder.group({
        Id: new FormControl(""),
        Name: new FormControl(""),
        Sequence: new FormControl(this.criteriasFormArr.length+1),
        Questions: this.formBuilder.array([])
      })
    );
    this.updatePattern();
  }

  addNewQuestion(id: number) {
    this.questionsFormArr(id).push(
      this.formBuilder.group({
        Id: new FormControl(""),
        Name: new FormControl(""),
        Hint: new FormControl(""),
        Sequence: new FormControl(this.questionsFormArr(id).length+1),
        Formula: new FormControl("" , Validators.pattern(this.formulaPattern)),
        MeasureId: new FormControl(""),
        Hidden: new FormControl(""),
        FillMethodId: new FormControl(""),
      })
    );
    this.updatePattern();
  }

  private refreshFillMethods(): void{
    this.fillMethodService.getAll()
      .subscribe({
        next: (data) => {
          this.fillMethods = data;
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  private refreshMeasures(): void{
    this.measureService.getAll()
      .subscribe({
        next: (data) => {
          this.measures = data;
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  public getLetterByNumber(number: number): string {    
    if (number < 1 || number > 30) {
      return "Число вне диапазона";
    }

    const letters = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ';
    return letters.charAt(number - 1);
  }

  public saveChanges(){
    let formPut: FormPut = {} as FormPut;
    formPut.id = this.form.id;
    formPut.name = this.formGroup.value.Name;
    this.formSerive.update(formPut).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.log(error);
      }
    });

    let criterias: CriteriaPut[] = new Array<CriteriaPut>;
    this.criteriasFormArr.controls.forEach((element, index) =>{
      let criteria = element.value;
      criterias.push({
        id: criteria.Id, 
        name: criteria.Name,
        formId: this.form.id, 
        sequence: criteria.Sequence
      }) 
    })
    console.log(criterias);
    
    
    let questions: QuestionPut[] = new Array<QuestionPut>;
    this.criteriasFormArr.controls.forEach((criteriaControl, index) =>{
      this.questionsFormArr(index).controls.forEach((questionControl, index) => {
        let question = questionControl.value
        questions.push({
          id: question.Id,
          name: question.Name, 
          hint: question.Hint,  
          criteriaId: criteriaControl.value.Id,
          sequence: question.Sequence,  
          formula: question.Formula,             
          measureId: question.MeasureId, 
          hidden: question.Hidden, 
          fillMethodId: question.FillMethodId
        });
      });
    });
    this.questionService.updateArray(questions).subscribe({
        next: (data) => {
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  public saveNew(): void{
    let newForm : FormPost = {name: this.formGroup.value.Name} as FormPost;
    this.formSerive.create(newForm).subscribe({
      next: (data) =>{
        this.form = data;
        let criterias: CriteriaPost[] = new Array<CriteriaPost>;
        this.criteriasFormArr.controls.forEach((element, index) => {
          let criteria = element.value;
          criteria.Id = this.form.id;
          criterias.push({
            name: criteria.Name,
            formId: this.form.id, 
            sequence: criteria.Sequence
          }) 
        })
        this.criteriaService.createArray(criterias).subscribe({
          next: (data) => {
            let newCriterias : Criteria[] = data;
            let questions: QuestionPost[] = new Array<QuestionPost>;
            newCriterias.forEach((criteria, index) => {
              this.questionsFormArr(index).controls.forEach(questionControl => {
                let question = questionControl.value
                questions.push({
                  name: question.Name, 
                  hint: question.Hint,  
                  criteriaId: criteria.id,  
                  sequence: question.Sequence,  
                  formula: question.Formula,             
                  measureId: question.MeasureId, 
                  hidden: question.Hidden, 
                  fillMethodId: question.FillMethodId
                });
              })
            });
            this.questionService.createArray(questions).subscribe({
              next: (data) => {
              this.router.navigate(["/forms"])
              },
              error: (error) => {
                console.log(error);
              }
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) =>{
        console.log(error);
      },
    })
  }
}

