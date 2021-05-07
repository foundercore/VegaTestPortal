import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagemntComponent } from './user-managemnt.component';

describe('UserManagemntComponent', () => {
  let component: UserManagemntComponent;
  let fixture: ComponentFixture<UserManagemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagemntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
