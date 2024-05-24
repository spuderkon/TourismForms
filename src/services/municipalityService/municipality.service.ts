import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Municipality } from '../../data/models/municipality/municipality.interface';
import { Observable } from 'rxjs';
import { Constants } from '../../data/constants';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  private readonly url: string
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Municipality";
  }

  public getAll() : Observable<Municipality[]>{
    return this.httpClient.get<Municipality[]>(this.url +"/GetAll", { headers: this.headers })
  }

}
