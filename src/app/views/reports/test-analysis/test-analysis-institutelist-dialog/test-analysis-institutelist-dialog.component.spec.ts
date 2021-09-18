import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAnalysisInstitutelistDialogComponent } from './test-analysis-institutelist-dialog.component';

describe('TestAnalysisInstitutelistDialogComponent', () => {
  let component: TestAnalysisInstitutelistDialogComponent;
  let fixture: ComponentFixture<TestAnalysisInstitutelistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAnalysisInstitutelistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnalysisInstitutelistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
