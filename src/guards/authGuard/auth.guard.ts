import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService);
  if (typeof window == 'undefined') {
    
  }
  else{
    if(authService.isLoggedIn()){
      return true;
    }
    router.navigate(['/auth']);
    return false;
  }
 return false;
};
