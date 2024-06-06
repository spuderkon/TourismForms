import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../data/constants';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Criteria } from '../../data/models/criteria/criteria.interface';
import { CriteriaPost } from '../../data/requestModels/criteria-post.interface';
import { CriteriaPut } from '../../data/requestModels/criteria-put.interface';

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Criteria";
  }

  public createArray(criterias: CriteriaPost[]) : Observable<Criteria[]>{
    return this.httpClient.post<Criteria[]>(this.url + "/CreateArray", JSON.stringify(criterias), {headers: this.headers});
  }

  public updateArray(criterias: CriteriaPut[]) : Observable<void>{
    return this.httpClient.put<void>(this.url + "/UpdateArray", JSON.stringify(criterias), {headers: this.headers});
  }
}
