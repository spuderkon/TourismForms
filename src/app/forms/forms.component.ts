import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Municipality } from '../../data/models/municipality/municipality.interface';
import { MunicipalityService } from '../../services/municipalityService/municipality.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormService } from '../../services/formService/form.service';
import { Form } from '../../data/models/form/form.interface';
import { City } from '../../data/models/city/city.interface';
import { CityService } from '../../services/cityService/city.service';
import { error } from 'console';
import { DataSource } from '@angular/cdk/collections';
import { SurveyService } from '../../services/surveyService/survey.service';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SurveyPost } from '../../data/requestModels/survey-post.interface';
import moment from 'moment';
import { AuthService } from '../../services/authService/auth.service';
import { SurveyExtendDialog } from '../surveys/surveys.component';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements OnInit{

  public forms: Form[];

  constructor(public dialog: MatDialog, private router: Router,private formService:FormService, public authService: AuthService){
    this.forms = new Array<Form>;
  }

  ngOnInit(): void {
    this.refreshAllForms();
  }

  public openSelectMunicipalityDialog(formId: number){
    const dialog = this.dialog.open(SelectMunicipalityDialog, {data: formId});
  }

  private refreshAllForms(): void{
    this.formService.getAll()
    .subscribe({
      next: (data) => {
        this.forms = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public report(form: Form): void{
    this.formService.getExcel(form.id).subscribe({
      next: (data) =>{
        let fileName = data.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        let blob: Blob = data.body as Blob;
        let a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      error(err) {
        console.log(err);
      },
    })
  }

  public routeToForm(id: number): void{
    this.router.navigate(["form", id])
  }
}

@Component({
  selector: 'select-municipality-dialog',
  templateUrl: 'select-municipality-dialog.html',
})
export class SelectMunicipalityDialog implements OnInit {

  public dataSource: MatTableDataSource<City>;
  public displayedColumns: string[];
  public selectedCities: City[]; 
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private cityService: CityService, private surveyService: SurveyService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<City>;
    this.displayedColumns = ["Selected","RegionName","MunicipalityName", "CityName"]
    this.selectedCities = new Array<City>;
  }

  ngOnInit(): void {
    this.refreshAllCities();
  }

  public refreshAllCities(): void{
    this.cityService.getAllWithMuniciplaity().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public goToSelectDate(): void{
    let surveysToSend: SurveyPost[] = new Array<SurveyPost>; 
    this.selectedCities.forEach((element) => {
      surveysToSend.push({
        formId: this.data,
        startDate: "",
        endDate: "",
        municipalityId: element.municipalityId,
        cityId: element.id,
      })
    });
    const dialog = this.dialog.open(ChooseDatesDialog, {data:surveysToSend});
  }

  public selectMunicipality(city: City, event: MatCheckboxChange): void{
    if(event.checked){
      this.selectedCities.push(city);
    }
    else{
      this.selectedCities.splice(this.selectedCities.findIndex(item => item == city), 1);
    }
  }
}

@Component({
  selector: 'choose-dates-dialog',
  templateUrl: 'choose-dates-dialog.html',
})
export class ChooseDatesDialog implements OnInit {

  public start: FormControl;
  public end: FormControl;
  public minDate : string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SurveyPost[], public dialogRef: MatDialogRef<SurveyExtendDialog>, private surveyService: SurveyService){
    this.start = new FormControl(null, Validators.required);
    this.end = new FormControl(null, Validators.required);
    this.minDate = moment(new Date()).format('YYYY-MM-DD')
  }

  ngOnInit(): void {
    
  }

  public appointMuncipalities(): void{
    this.data.forEach((element) => {
      element.startDate = moment(this.start.value).format('YYYY-MM-DD HH:mm:ss.SSS');
      element.endDate = moment(this.start.value).format('YYYY-MM-DD HH:mm:ss.SSS');
    })
    this.surveyService.createArray(this.data).subscribe({
      next: (data) => {
        this.dialogRef.close();
      },
      error(err) {
        console.log(err);
      },
    })
  }
}