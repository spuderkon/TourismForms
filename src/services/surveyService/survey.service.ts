import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { Survey } from '../../data/models/survey/survey.interface';
import { Observable } from 'rxjs';
import { SurveyPost } from '../../data/requestModels/survey-post.interface';
import { SurveyRevisionPut } from '../../data/requestModels/survey-revision-put.interface';
import { Form } from '../../data/models/form/form.interface';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Survey";
  }

  public getAll(): Observable<Survey[]>{
    return this.httpClient.get<Survey[]>(this.url + "/GetAll", { headers : this.headers });
  }

  public getMyAll(): Observable<Survey[]>{
    return this.httpClient.get<Survey[]>(this.url + "/GetMyAll", { headers : this.headers });
  }
  public getMyById(id: number): Observable<Form>{
    return this.httpClient.get<Form>(this.url + "/GetMyById/" + id, { headers : this.headers });
  }
  public getExcel(id: number): Observable<any>{
    let customHeaders = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));
    return this.httpClient.get(this.url + "/GetExcel/" + id, {headers : customHeaders, observe: 'response',responseType: 'blob'});
  }
  public createArray(surveyPost: SurveyPost[]): Observable<void>{
    return this.httpClient.post<void>(this.url + "/CreateArray", JSON.stringify(surveyPost), { headers : this.headers });
  }
  public extend(id: number, completionDate: Date): Observable<void>{
    return this.httpClient.put<void>(this.url + "/Extend/"+ id + "/" + completionDate, { headers : this.headers });
  }
  public revision(surveyRevisionPut: SurveyRevisionPut): Observable<void>{
    return this.httpClient.put<void>(this.url + "/Revision", JSON.stringify(surveyRevisionPut), { headers : this.headers });
  }
  public submitForEvaluation(id: number): Observable<void>{
    return this.httpClient.put<void>(this.url + "/SubmitForEvaluation/" + id , { headers : this.headers });
  }
  public delete(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.url + "/Delete/" + id , { headers : this.headers });
  }
}
