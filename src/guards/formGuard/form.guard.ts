import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const FormGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(route.paramMap.get('id') == "create" || !isNaN(Number(route.paramMap.get('id'))))
    {
      return true;
    }
    router.navigate(['/forms']);
    return false;
};
