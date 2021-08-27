import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStudentTableComponent } from './test-student-table.component';

describe('TestStudentTableComponent', () => {
  let component: TestStudentTableComponent;
  let fixture: ComponentFixture<TestStudentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestStudentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
