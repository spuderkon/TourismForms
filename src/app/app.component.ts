import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TourismForms';

  constructor(public authService: AuthService,protected router: Router){
    
  }

  logout(): void{
    this.authService.logout();
  }
}
