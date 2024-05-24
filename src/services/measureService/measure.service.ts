import { Injectable } from '@angular/core';
import { Measure } from '../../data/models/measure/measure.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../../data/constants';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  private readonly url: string
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token'));

  constructor(private httpClient: HttpClient, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/Measure";
  }

  public getAll() : Observable<Measure[]>{
    return this.httpClient.get<Measure[]>(this.url + "/GetAll", { headers: this.headers })
  }
}
