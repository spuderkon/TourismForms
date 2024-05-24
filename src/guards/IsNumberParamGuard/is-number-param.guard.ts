import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const IsNumberParamGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
    if(!isNaN(Number(route.paramMap.get('id'))) )
    {
        return true;
    }
    router.navigate(['/surveys']);
    return false;
  
};
