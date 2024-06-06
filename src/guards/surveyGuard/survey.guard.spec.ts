import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { SurveyGuard } from './survey.guard';

describe('SurveyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => SurveyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
