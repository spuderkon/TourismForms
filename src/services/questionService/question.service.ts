import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { Observable } from 'rxjs';
import { QuestionPost } from '../../data/requestModels/question-post.interface';
import { QuestionPut } from '../../data/requestModels/question-put.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Question";
  }

  public createArray(quesitons: QuestionPost[]) : Observable<void>{
    return this.httpClient.post<void>(this.url + "/CreateArray", JSON.stringify(quesitons), {headers: this.headers});
  }

  public updateArray(quesitons: QuestionPut[]) : Observable<void>{
    return this.httpClient.put<void>(this.url + "/UpdateArray", JSON.stringify(quesitons), {headers: this.headers});
  }
}
