import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const IsCreateParamGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
    if(route.paramMap.get('id') == "create")
    {
      return true;
    }
    router.navigate(['/surveys']);
    return false;
  
};
