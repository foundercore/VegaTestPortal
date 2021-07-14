import { AssignmentRequest } from './../../../models/test-assignment/test-assignment-request';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TestAssignmentServiceService } from 'src/app/services/assignment/test-assignment-service.service';
import { UserService } from 'src/app/services/users/users.service';
import { StudentBatchService } from 'src/app/services/student-batch/student-batch.service';
import { StudentBatchModel } from 'src/app/models/student-batch/student-batch-model';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AssignmentFormComponent implements OnInit, AfterViewInit {
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  batchList: StudentBatchModel[] = [];
  locale = 'en-US';

  assignmentFormGroup: FormGroup;

  minValidDateTo: Date;

  minReleaseDate: Date;
  maxReleaseDate: Date;
  filteredBatchList: Observable<StudentBatchModel[]>;
  selectedAssignedBatches = [];
  searchBatch = new FormControl();
  @ViewChild('batchInput') batchInput: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<AssignmentFormComponent>,
    private studentBatchService: StudentBatchService,
    private testAssignmentService: TestAssignmentServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: ChangeDetectorRef
  ) {
    this.studentBatchService.getStudentBatchList().subscribe((data) => {
      this.batchList = data;
      this.filteredBatchList = this.searchBatch.valueChanges.pipe(
        startWith(''),
        map((value: String) => {
          const filterValue = value?.toLowerCase();

          return filterValue
            ? this.batchList.filter((option) =>
                option.name.toLowerCase().includes(filterValue)
              )
            : this.batchList;
        })
      );
      const batchesAssigned: string[] = this.data.data.assignedToBatch;
      this.selectedAssignedBatches = this.batchList.filter((batch) =>
        batchesAssigned.some((id) => id == batch.id.batchId)
      );
      batchesAssigned.forEach(
        (batch) =>
          (this.batchList.find((b) => b.id.batchId == batch).selected = true)
      );
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    if (this.data.data) {
      console.log(this.data.data);
      this.minReleaseDate = this.data.data.validFrom;
      this.maxReleaseDate = this.data.data.validTo;
      this.minValidDateTo = this.data.data.validFrom;
      this.assignmentFormGroup = new FormGroup({
        passcode: new FormControl(this.data.data.passcode),
        description: new FormControl(this.data.data.description, [
          Validators.required,
        ]),
        releaseDate: new FormControl(this.data.data.releaseDate, [
          Validators.required,
        ]),
        validFrom: new FormControl(this.data.data.validFrom, [
          Validators.required,
        ]),
        validTo: new FormControl(this.data.data.validTo, [Validators.required]),
        assignedToBatch: new FormControl([], [Validators.required]),
      });
    } else {
      this.minValidDateTo = new Date();
      this.minReleaseDate = this.minValidDateTo;
      this.assignmentFormGroup = new FormGroup({
        passcode: new FormControl(''),
        description: new FormControl('', [Validators.required]),
        releaseDate: new FormControl('', [Validators.required]),
        validFrom: new FormControl(new Date(), [Validators.required]),
        validTo: new FormControl('', [Validators.required]),
        assignedToBatch: new FormControl([], [Validators.required]),
      });
    }
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const batchToAdd = this.batchList.find(
        (batch) => batch.id.batchId == value
      );
      if (batchToAdd.selected) return;
      batchToAdd.selected = true;
      this.selectedAssignedBatches.push(batchToAdd);
    }

    // Clear the input value
    if (event.input) event.input.value = '';
    this.searchBatch.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const batchToAdd = this.batchList.find(
      (batch) => batch.id.batchId == event.option.value
    );
    if (batchToAdd.selected) return;
    batchToAdd.selected = true;
    this.selectedAssignedBatches.push(batchToAdd);
    this.batchInput.nativeElement.value = '';
    this.searchBatch.setValue(null);
  }

  isSelected(id: string) {
    return this.batchList.find((batch) => batch.id.batchId == id).selected;
  }

  remove(batch: StudentBatchModel) {
    const batchMatched = this.selectedAssignedBatches.findIndex(
      (b) => batch.id.batchId == b.id.batchId
    );
    this.selectedAssignedBatches.splice(batchMatched, 1);
    this.batchList.find((b) => batch.id.batchId == b.id.batchId).selected =
      false;
  }

  add() {
    console.log(this.assignmentFormGroup.controls);
    this.assignmentFormGroup.controls['assignedToBatch'].setValue(
      this.selectedAssignedBatches.map((batch) => batch.id.batchId)
    );
    if (this.assignmentFormGroup.invalid) {
      return;
    }
    const assignmentObj: AssignmentRequest = {
      description: this.assignmentFormGroup.controls.description.value,
      passcode: this.assignmentFormGroup.controls.passcode.value,
      releaseDate: formatDate(
        this.assignmentFormGroup.controls.releaseDate.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      testId: this.data.testId,
      validFrom: formatDate(
        this.assignmentFormGroup.controls.validFrom.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      validTo: formatDate(
        this.assignmentFormGroup.controls.validTo.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      assignedToBatch: this.assignmentFormGroup.controls.assignedToBatch.value,
    };

    this.testAssignmentService.addAssignment(assignmentObj).subscribe(
      (resp) => {
        this.tosterService.success('Assignment is created successfully');
        this.dialogRef.close();
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }

  edit() {
    console.log(this.assignmentFormGroup.controls);
    this.assignmentFormGroup.controls['assignedToBatch'].setValue(
      this.selectedAssignedBatches.map((batch) => batch.id.batchId)
    );
    if (this.assignmentFormGroup.invalid) {
      return;
    }
    const assignmentObj: AssignmentRequest = {
      description: this.assignmentFormGroup.controls.description.value,
      passcode: this.assignmentFormGroup.controls.passcode.value,
      releaseDate: formatDate(
        this.assignmentFormGroup.controls.releaseDate.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      testId: this.data.testId,
      validFrom: formatDate(
        this.assignmentFormGroup.controls.validFrom.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      validTo: formatDate(
        this.assignmentFormGroup.controls.validTo.value,
        'yyyy-MM-dd hh:mm:ss',
        this.locale
      ),
      assignedToBatch: this.assignmentFormGroup.controls.assignedToBatch.value,
    };
    this.testAssignmentService
      .updateAssignment(this.data.data.assignmentId, assignmentObj)
      .subscribe(
        (resp) => {
          this.tosterService.success('Assignment is updated successfully');
          this.dialogRef.close();
        },
        (error) => {
          this.tosterService.error(error.error.apierror.message);
        }
      );
  }

  reset() {
    this.assignmentFormGroup.reset();
  }

  validDateFromChangeTrigger(event) {
    this.minValidDateTo = event.value;
    this.minReleaseDate = event.value;
  }

  validDateToChangeTrigger(event) {
    this.maxReleaseDate = event.value;
  }
}
