/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LiveTestWindowComponent } from './live-test-window.component';

describe('LiveTestWindowComponent', () => {
  let component: LiveTestWindowComponent;
  let fixture: ComponentFixture<LiveTestWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTestWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTestWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
