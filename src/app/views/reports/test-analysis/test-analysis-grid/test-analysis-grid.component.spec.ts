import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAnalysisGridComponent } from './test-analysis-grid.component';

describe('TestAnalysisGridComponent', () => {
  let component: TestAnalysisGridComponent;
  let fixture: ComponentFixture<TestAnalysisGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAnalysisGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnalysisGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
