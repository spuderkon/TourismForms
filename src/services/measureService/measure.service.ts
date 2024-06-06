import { Injectable } from '@angular/core';
import { Measure } from '../../data/models/measure/measure.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../../data/constants';
import { MeasurePost } from '../../data/requestModels/measure-post.interface';
import { MeasurePut } from '../../data/requestModels/measure-put.interface';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  private readonly url: string
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/Measure";
  }

  public getAll() : Observable<Measure[]>{
    return this.httpClient.get<Measure[]>(this.url + "/GetAll", { headers: this.headers })
  }
  public create(measurePost: MeasurePost) : Observable<Measure>{
    return this.httpClient.post<Measure>(this.url + "/Create", JSON.stringify(measurePost), { headers: this.headers })
  }
  public update(measurePut: MeasurePut) : Observable<void>{
    return this.httpClient.put<void>(this.url + "/Update", JSON.stringify(measurePut), { headers: this.headers })
  }
  public delete(id: number) : Observable<void>{
    return this.httpClient.delete<void>(this.url + "/Delete/" + id, { headers: this.headers })
  }
}
