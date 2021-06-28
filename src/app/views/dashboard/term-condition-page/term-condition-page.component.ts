import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { IUserModel, IUserUpdateRequestModel } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/users/users.service';
import { UpdateTermConditionState } from 'src/app/state_management/_actions/user.action';
  import { AppState } from 'src/app/state_management/_states/auth.state';

@Component({
  selector: 'app-term-condition-page',
  templateUrl: './term-condition-page.component.html',
  styleUrls: ['./term-condition-page.component.scss']
})
export class TermConditionPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private tosterService: ToastrService,
     public dialogRef: MatDialogRef<TermConditionPageComponent>,
     @Inject(MAT_DIALOG_DATA) public data: IUserModel,
     private store: Store<AppState>,
    ) { }

  ngOnInit() {
  }

  accept(){
    const model : IUserUpdateRequestModel = {
      acceptedTerms: true,
      acceptedTermsOn: new Date(),
      address: this.data.address,
      displayName: this.data.displayName,
      firstName: this.data.firstName,
      gender: this.data.gender,
      lastName: this.data.lastName,
      roles: this.data.authorities.map(x => x.authority),
      state: this.data.state,
      enabled: this.data.enabled,
    }
    this.userService.updateUsers(model, this.data.userName).subscribe(
      (resp) => {
        this.tosterService.success('Term and Condition successfully accepted');
        this.dialogRef.close();
        this.store.dispatch(new UpdateTermConditionState({acceptedTerms: true ,acceptedTermsOn :model.acceptedTermsOn}));
      },
      (error) => {
        this.tosterService.error(error.error.apierror.message);
      }
    );
  }
}
