import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { Observable } from 'rxjs';
import { AnswerPost } from '../../data/models/requestModels/AnswerPost/answerPost.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private readonly url: string;
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient,private router: Router, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/Answer";
  }

  public saveMyAll(answerPost: AnswerPost[]): Observable<void>{
    return this.httpClient.post<void>(this.url+"/SaveMyAll", JSON.stringify(answerPost), {headers: this.headers})
  }
}
