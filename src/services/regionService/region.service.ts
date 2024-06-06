import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../data/constants';
import { Region } from '../../data/models/region/region.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private readonly url: string;
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/Region";
  }

  public getAll(): Observable<Region[]>{
    return this.httpClient.get<Region[]>(this.url + "/GetAll", {headers: this.headers});
  }
}
