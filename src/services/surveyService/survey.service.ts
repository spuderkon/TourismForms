import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { Survey } from '../../data/models/survey/survey.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Survey";
  }

  public getMyAll(): Observable<Survey[]>{
    return this.httpClient.get<Survey[]>(this.url + "/GetMyAll", { headers : this.headers })
  }
}
