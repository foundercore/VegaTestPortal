import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentEditorComponent } from './assessment-editor.component';

describe('AssessmentEditorComponent', () => {
  let component: AssessmentEditorComponent;
  let fixture: ComponentFixture<AssessmentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
