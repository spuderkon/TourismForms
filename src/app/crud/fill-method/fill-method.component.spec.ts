import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillMethodComponent } from './fill-method.component';

describe('FillMethodComponent', () => {
  let component: FillMethodComponent;
  let fixture: ComponentFixture<FillMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FillMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FillMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
