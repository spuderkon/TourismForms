import { Component, Inject, OnInit } from '@angular/core';
import { MunicipalityService } from '../../services/municipalityService/municipality.service';
import { SurveyService } from '../../services/surveyService/survey.service';
import { Survey } from '../../data/models/survey/survey.interface';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css'
})
export class SurveysComponent implements OnInit {

  public surveysToDiplay: Survey[];

  constructor(private surveySerive: SurveyService, public router: Router, private dialog: MatDialog, private municipalityService: MunicipalityService){
    this.surveysToDiplay = new Array<Survey>;
  }

  ngOnInit() : void{
    if(this.router.url == "/surveys")
      this.refreshAllMySurveys();
    else if (this.router.url == "/admin/surveys")
      this.refreshAllSurveys();
  }


  private refreshAllMySurveys(): void{
    this.surveySerive.getMyAll()
    .subscribe({
      next: (data) => {
        this.surveysToDiplay = data;
        console.log(this.surveysToDiplay);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  private refreshAllSurveys(): void{
    this.surveySerive.getAll()
    .subscribe({
      next: (data) => {
        this.surveysToDiplay = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public routeToSurvey(id: number): void{
    if(this.router.url == "/surveys")
      this.router.navigate(["survey", id])
    else
      this.router.navigate(["admin/survey", id])
  }

  public report(survey: Survey): void{
    this.surveySerive.getExcel(survey.formId).subscribe({
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

  public extend(survey: Survey): void{
    this.dialog.open(SurveyExtendDialog, {data: survey})
  }

  public revision(survey: Survey): void{
    this.dialog.open(SurveyRevisionDialog, {data: survey})
  }

  public recall(survey: Survey): void{
    this.surveySerive.delete(survey.id).subscribe({
      next: (data) => {
        this.surveysToDiplay.splice(this.surveysToDiplay.findIndex(item => item == survey), 1);
      },
      error(err) {
        console.log(err);
      },
    })
  }
}

@Component({
  selector: 'survey-extend-dialog',
  templateUrl: 'survey-extend-dialog.html',
})
export class SurveyExtendDialog implements OnInit {

  public completionDate: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Survey, public dialogRef: MatDialogRef<SurveyExtendDialog>, private surveyService: SurveyService){
    this.completionDate = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    
  }

  public complete(): void{
    this.surveyService.extend(this.data.id, this.completionDate.value).subscribe({
      next: (value) => {
        this.dialogRef.close();
      },
      error(err) {
        console.log(err);
      },
    })
  }
}

@Component({
  selector: 'survey-revision-dialog',
  templateUrl: 'survey-revision-dialog.html',
})
export class SurveyRevisionDialog implements OnInit {

  public completionDate: FormControl;
  public comment: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Survey, public dialogRef: MatDialogRef<SurveyRevisionDialog>, private surveyService: SurveyService){
    this.completionDate = new FormControl(null, Validators.required);
    this.comment = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    
  }

  public complete(): void{
    this.surveyService.revision({id: this.data.id, comment: this.comment.value, completionDate: this.completionDate.value}).subscribe({
      next: (value) => {
        this.dialogRef.close();
      },
      error(err) {
        console.log(err);
      },
    })
  }
}