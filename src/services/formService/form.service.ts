import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Form } from '../../data/models/form/form.interface';
import { Observable } from 'rxjs';
import { Constants } from '../../data/constants';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private router: Router, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Form";
  }

  public getAll() : Observable<Form[]>{
    return this.httpClient.get<Form[]>(this.url + "/GetAll", {headers: this.headers});
  }

  public getById(id: number) : Observable<Form>{
    return this.httpClient.get<Form>(this.url + "/GetById/"+ id, {headers: this.headers});
  }
}
