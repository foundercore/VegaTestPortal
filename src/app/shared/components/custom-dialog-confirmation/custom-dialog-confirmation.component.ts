import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomDialogConfirmationModel } from './custom-dialog-confirmation-model';

@Component({
  selector: 'app-custom-dialog-confirmation',
  templateUrl: './custom-dialog-confirmation.component.html',
  styleUrls: ['./custom-dialog-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDialogConfirmationComponent implements OnInit {

  title: string;
  message: string;
  confirmText: string;
  cancelText: string;

  constructor(
    public dialogRef: MatDialogRef<CustomDialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomDialogConfirmationModel
    ) {
     this.title = data.title;
    this.message = data.message;
    this.confirmText = data.confirmText;
    this.cancelText = data.cancelText
  }

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
