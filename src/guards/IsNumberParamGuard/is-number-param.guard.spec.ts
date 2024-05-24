import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { IsNumberParamGuard } from './is-number-param.guard';

describe('IsNumberParamGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => IsNumberParamGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
