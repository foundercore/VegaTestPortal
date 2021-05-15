import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTestConfigurationComponent } from './setup-test-configuration.component';

describe('SetupTestConfigurationComponent', () => {
  let component: SetupTestConfigurationComponent;
  let fixture: ComponentFixture<SetupTestConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupTestConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTestConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
