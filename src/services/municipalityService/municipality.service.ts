import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Municipality } from '../../data/models/municipality/municipality.interface';
import { Observable } from 'rxjs';
import { Constants } from '../../data/constants';
import { MunicipalityPost } from '../../data/requestModels/municipality-post.interface';
import { MunicipalityPut } from '../../data/requestModels/municipality-put.interface';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  private readonly url: string
  private httpParams = new HttpParams();
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');;

  constructor(private httpClient: HttpClient, private constants: Constants) {
    this.url = this.constants.GetUrl() + "/Municipality";
  }

  public getAll() : Observable<Municipality[]>{
    return this.httpClient.get<Municipality[]>(this.url + "/GetAll", { headers: this.headers })
  }

  public create(municipalityPost: MunicipalityPost) : Observable<Municipality>{
    return this.httpClient.post<Municipality>(this.url + "/Create", JSON.stringify(municipalityPost), { headers: this.headers })
  }

  public update(municipalityPut: MunicipalityPut) : Observable<void>{
    return this.httpClient.put<void>(this.url + "/Update", JSON.stringify(municipalityPut), { headers: this.headers })
  }

  public delete(id: number) : Observable<void>{
    return this.httpClient.delete<void>(this.url + "/Delete/" + id, { headers: this.headers })
  }
}
