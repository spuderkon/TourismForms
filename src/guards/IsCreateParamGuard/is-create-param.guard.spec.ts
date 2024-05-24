import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { IsCreateParamGuard } from './is-create-param.guard';

describe('IsCreateParamGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => IsCreateParamGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
