import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FillMethod } from '../../data/models/fillMethod/fill-method.interface';
import { Observable } from 'rxjs';
import { Constants } from '../../data/constants';

@Injectable({
  providedIn: 'root'
})
export class FillMethodService {

  private readonly url: string;
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/FillMethod";
  }

  public getAll() : Observable<FillMethod[]>{
    return this.httpClient.get<FillMethod[]>(this.url + "/GetAll", { headers: this.headers });
  }
}
