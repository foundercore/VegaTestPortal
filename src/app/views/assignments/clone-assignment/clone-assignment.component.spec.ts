import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneAssignmentComponent } from './clone-assignment.component';

describe('CloneAssignmentComponent', () => {
  let component: CloneAssignmentComponent;
  let fixture: ComponentFixture<CloneAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
