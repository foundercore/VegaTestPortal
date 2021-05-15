import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestContentComponent } from './update-test-content.component';

describe('UpdateTestContentComponent', () => {
  let component: UpdateTestContentComponent;
  let fixture: ComponentFixture<UpdateTestContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTestContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTestContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
