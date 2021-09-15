import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAnalysisQuestionPreviewComponent } from './test-analysis-question-preview.component';

describe('TestAnalysisQuestionPreviewComponent', () => {
  let component: TestAnalysisQuestionPreviewComponent;
  let fixture: ComponentFixture<TestAnalysisQuestionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAnalysisQuestionPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnalysisQuestionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
