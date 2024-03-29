import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAnalysisComponent } from './test-analysis.component';

describe('TestAnalysisComponent', () => {
  let component: TestAnalysisComponent;
  let fixture: ComponentFixture<TestAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
