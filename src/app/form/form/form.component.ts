import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Criteria } from '../../../data/models/criteria/criteria.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MeasureService } from '../../../services/measureService/measure.service';
import { FillMethodService } from '../../../services/fillMethodService/fill-method.service';
import { Measure } from '../../../data/models/measure/measure.interface';
import { FillMethod } from '../../../data/models/fillMethod/fill-method.interface';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '../../../data/models/form/form.interface';
import { FormService } from '../../../services/formService/form.service';
import { Question } from '../../../data/models/question/question.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit, OnChanges {
  public measures: Measure[];
  public fillMethods: FillMethod[];
  public criterias: FormArray = new FormArray<any>([]);
  public questions: FormArray = new FormArray<any>([]);
  public idParam: string | null = null;
  
  form!: Form;
  formGroup: FormGroup;

  constructor(private formSerive: FormService, private measureService: MeasureService, private fillMethodService: FillMethodService, private route:ActivatedRoute, private formBuilder : FormBuilder){
    this.formGroup = this.formBuilder.group({});
    this.measures = new Array<Measure>();
    this.fillMethods = new Array<FillMethod>();

    this.formGroup = this.formBuilder.group({
      Id : new FormControl("", Validators.required),
      Name: new FormControl("", Validators.required),
      CreationDate: new FormControl("", Validators.required),
      ModifiedDate: new FormControl(""),
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
  }

  ngOnInit(): void {
    this.refreshFillMethods();
    this.refreshMeasures();

    this.route.params.subscribe(params => {
      this.idParam = params["id"];
      if (this.idParam == "create") {
            
      } 
      else {
          this.refreshFormById(Number(this.idParam))
      }
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  Save(checked: Question | null){
    console.log(checked);
  }

  private refreshFormById(id: number): void{
    this.formSerive.getById(id)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.form = data;
          this.setFormGroup(this.form);
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
        Sequence: [this.getLetterByNumber(c.sequence), Validators.required],
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
        Formula: new FormControl(q.formula, {validators: [Validators.required, Validators.pattern("^(([А-Я]\\d+)|(\\d+(\\.\\d+)?))(([\\+\\-\\*\\/]{1})(([А-Я]\\d+)|(\\d+(\\.\\d+)?)))*$")]}),
        MeasureId: [q.measureId, Validators.required],                                              
        Hidden: [q.hidden, Validators.required],
        FillMethodId: [q.fillMethodId, Validators.required],
      })) 
    })
    return arr;
  }

  increaseCriteriaSequence(index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != 0){
      const criteriaTmp = this.criteriasFormArr.at(index)
      this.criteriasFormArr.at(index).value.Sequence = this.getLetterByNumber(index);
      this.removeCriteriaGroup(index)
      this.criteriasFormArr.insert(index-1, criteriaTmp)
      this.criteriasFormArr.at(index).value.Sequence = this.getLetterByNumber(index + 1);
    }
  }

  decreaseCriteriaSequence(index: number, event: MouseEvent): void{
    event.stopPropagation();
    if(index != this.criteriasFormArr.length-1){
      const criteriaTmp = this.criteriasFormArr.at(index+1)
      criteriaTmp.value.Sequence = this.getLetterByNumber(index+1);
      this.criteriasFormArr.at(index).value.Sequence = this.getLetterByNumber(index+2);
      this.removeCriteriaGroup(index+1)
      this.criteriasFormArr.insert(index, criteriaTmp)
    }
  }

  private removeCriteriaGroup(index: number) {
    this.criteriasFormArr.removeAt(index);
  }

  increaseQuestionSequence(criteriaId: number, index: number, event: MouseEvent): void{
    event.stopPropagation();
    console.log(this.questionsFormArr(criteriaId).at(index));
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
    console.log(this.questionsFormArr(criteriaId).at(index));
    if(index != this.questionsFormArr(criteriaId).length-1){
      const questionTmp = this.questionsFormArr(criteriaId).at(index+1);
      questionTmp.value.Sequence = index+1;
      this.questionsFormArr(criteriaId).at(index).value.Sequence = index+2;
      this.removeQuestionGroup(criteriaId, index+1)
      this.questionsFormArr(criteriaId).insert(index, questionTmp)
    }
  }

  private removeQuestionGroup(criteriaId: number, index: number) {
    this.questionsFormArr(criteriaId).removeAt(index);
  }

  get criteriasFormArr() : FormArray {
    return this.formGroup.get('Criterias') as FormArray;
  }

  questionsFormArr(id: number): FormArray {
    return (this.formGroup.get('Criterias') as FormArray).at(id).get('Questions') as FormArray
  }

  addNewCriteria() {
    this.criteriasFormArr.push(
      this.formBuilder.group({
        Id: "",
        Name: "",
        Sequence: "",
        Questions: this.formBuilder.array([])
      })
    );
  }

  addNewQuestion(id: number) {
    this.questionsFormArr(id).push(
      this.formBuilder.group({
        Id: "",
        Name: "",
        Hint: "",
        Sequence: "",
        Formula: "",
        MeasureId: "",
        Hidden: "",
        FillMethodId: "",
      })
    );
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

  private getLetterByNumber(number: number): string {
    if (number < 1 || number > 26) {
        throw new Error('Число должно быть в диапазоне от 1 до 26');
    }
    
    const charCodeOfA = 'A'.charCodeAt(0);
    const charCodeOfGivenLetter = charCodeOfA + (number - 1);
    const letter = String.fromCharCode(charCodeOfGivenLetter);
    return letter;
}
}

