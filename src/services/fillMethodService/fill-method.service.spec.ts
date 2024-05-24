import { TestBed } from '@angular/core/testing';

import { FillMethodService } from './fill-method.service';

describe('FillMethodService', () => {
  let service: FillMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
