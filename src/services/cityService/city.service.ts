import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { Observable } from 'rxjs';
import { City } from '../../data/models/city/city.interface';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private readonly url: string;
  private headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('token')).set('Content-Type','application/json');

  constructor(private httpClient: HttpClient,private router: Router, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/City";
  }

  public getAllWithMuniciplaity(): Observable<City[]>{
    return this.httpClient.get<City[]>(this.url + "/GetAllWithMunicipality", {headers: this.headers});
  }
}
