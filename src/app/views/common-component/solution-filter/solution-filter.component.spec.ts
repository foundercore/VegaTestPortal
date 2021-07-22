import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionFilterComponent } from './solution-filter.component';

describe('FilterComponent', () => {
  let component: SolutionFilterComponent;
  let fixture: ComponentFixture<SolutionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
