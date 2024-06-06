import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css'
})
export class AuthorizationComponent {

  public userLogin: FormControl;
  public userPassword: FormControl;

  constructor(protected authService: AuthService, private router: Router){
    this.userLogin = new FormControl('Kungur', [Validators.required]);
    this.userPassword = new FormControl('123', [Validators.required]);
  }

  protected Authorize(){
    this.authService.authorize(this.userLogin.value, this.userPassword.value)
    .subscribe({
      next: (data) => {
        this.router.navigate(["/surveys"]);
      },
      error: (error) => {
        
      }
    });
  }

}

