/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudentAssignmentStatsChartsComponent } from './student-assignment-stats-charts.component';

describe('StudentAssignmentStatsChartsComponent', () => {
  let component: StudentAssignmentStatsChartsComponent;
  let fixture: ComponentFixture<StudentAssignmentStatsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAssignmentStatsChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAssignmentStatsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
