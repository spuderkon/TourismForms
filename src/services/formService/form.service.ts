import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../../data/models/form/form.interface';
import { Observable } from 'rxjs';
import { Constants } from '../../data/constants';
import { FormPut } from '../../data/requestModels/form-put.interface';
import { FormPost } from '../../data/requestModels/form-post.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Form";
  }

  public getAll() : Observable<Form[]>{
    return this.httpClient.get<Form[]>(this.url + "/GetAll", {headers: this.headers});
  }

  public getById(id: number) : Observable<Form>{
    return this.httpClient.get<Form>(this.url + "/GetById/"+ id, {headers: this.headers});
  }
  
  public getExcel(id: number): Observable<any>{
    return this.httpClient.get(this.url + "/GetExcel/" + id, {headers : this.headers, observe: 'response',responseType: 'blob'});
  }

  public update(formPut: FormPut) : Observable<void>{
    return this.httpClient.put<void>(this.url + "/Update", JSON.stringify(formPut), {headers: this.headers});
  }

  public create(formPost: FormPost) : Observable<Form>{
    return this.httpClient.post<Form>(this.url + "/Create", JSON.stringify(formPost), {headers: this.headers});
  }
}
