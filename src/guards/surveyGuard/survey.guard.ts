import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const SurveyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(route.paramMap.get('id') == "edit" || !isNaN(Number(route.paramMap.get('id'))))
    {
      return true;
    }
    router.navigate(['/surveys']);
    return false;
};
