import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NmatLiveTestComponent } from './nmat-live-test.component';

describe('NmatLiveTestComponent', () => {
  let component: NmatLiveTestComponent;
  let fixture: ComponentFixture<NmatLiveTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NmatLiveTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NmatLiveTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
