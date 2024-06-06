import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureComponent } from './measure.component';

describe('MeasureComponent', () => {
  let component: MeasureComponent;
  let fixture: ComponentFixture<MeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeasureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
