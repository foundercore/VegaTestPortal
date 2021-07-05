import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBulkUploadDialogComponent } from './user-bulk-upload-dialog.component';

describe('UserBulkUploadDialogComponent', () => {
  let component: UserBulkUploadDialogComponent;
  let fixture: ComponentFixture<UserBulkUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBulkUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBulkUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
