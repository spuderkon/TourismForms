import { Component, OnInit } from '@angular/core';
import { MunicipalityService } from '../../services/municipalityService/municipality.service';
import { SurveyService } from '../../services/surveyService/survey.service';
import { Survey } from '../../data/models/survey/survey.interface';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css'
})
export class SurveysComponent implements OnInit {

  public mySurveys: Survey[];

  constructor(private surveySerive: SurveyService, private municipalityService: MunicipalityService){
    this.mySurveys = new Array<Survey>;
  }

  ngOnInit() : void{
    this.refreshMyAll();
  }


  private refreshMyAll(): void{
    this.surveySerive.getMyAll()
    .subscribe({
      next: (data) => {
        this.mySurveys = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
