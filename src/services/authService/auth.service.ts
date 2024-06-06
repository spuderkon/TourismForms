import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../data/constants';
import { tap } from 'rxjs';
import * as crypto from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url: string;
  private httpParams = new HttpParams();
  

  constructor(private httpClient: HttpClient,private router: Router, private constants: Constants) { 
    this.url = this.constants.GetUrl() + "/Auth";
  }

  public authorize(login: string, password: string) {
    console.log('authorizing');
    return this.httpClient.post(this.url + '/Authorize?login='+login+"&password="+password, null)
    .pipe(
      tap((token: any) => 
        (this.setSession(token.Token, login, password)),
    ));
  }

  private setSession(token: string, login: string, password: string): void {
    console.log('Setting session')
    const encrypted = crypto.AES.encrypt(password, 'password');
    localStorage.setItem('token', token);
    const decodedToken = this.getDecodedToken();
    localStorage.setItem('login', login);
    localStorage.setItem('password', encrypted.toString());
    localStorage.setItem('IsAdmin', decodedToken.IsAdmin);
    localStorage.setItem('id', decodedToken.id)
    localStorage.setItem("expires_At", JSON.stringify(decodedToken.exp * 1000));
  }

  public testRefreshingToken(): void {
    localStorage.setItem("expires_At", JSON.stringify(1684260000* 1000));
  }

  public refreshToken() {
    console.log('refreshing token...')
    const bytes = crypto.AES.decrypt(localStorage.getItem('password')!, 'password');
    let login: string = localStorage.getItem('login')!;
    let password: string = bytes.toString(crypto.enc.Utf8);
    this.httpClient.post(this.url + '/Authorize?login='+login+"&password="+password, null).subscribe({
      next: (data: any) => {
        console.log(data.Token);
        this.setSession(data.Token, login, password);
      },
      error: (error) => {
        this.logout();
        console.log(error.error);
      },
    })
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
    window.location.reload();
  }

  public isLoggedIn(): boolean {
    if (this.getExpirationDate() > new Date()) {
      return true;
    }
    else {
      if (localStorage.getItem('login') != null && localStorage.getItem('password') != null) {
        this.refreshToken();
        return true;
      }
      return false;
    }
  }


  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }


  public getDecodedToken(): any {
    return jwtDecode(localStorage.getItem('token')!);
  }

  public getExpirationDate(): Date {
    return new Date(Number(localStorage.getItem('expires_At')));
  }

  public getRole(): string {
    return String(localStorage.getItem('role'));
  }

  public isAdminString(): string {
    return String(localStorage.getItem('IsAdmin'));
  }

  public isAdmin(): boolean {
    if (typeof window == 'undefined') {
    return false;
    }
    else{
    return localStorage.getItem('IsAdmin') == "True";
    }
  }

  checkUserAccess(availableRoles: string[], currentRole: string): boolean {
    if (availableRoles.includes(currentRole)) {
      return true
    }
    return false;
  }
}
