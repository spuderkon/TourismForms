import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isSignedInAuthGuard } from './is-signed-in-auth.guard';

describe('isSignedInAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isSignedInAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
