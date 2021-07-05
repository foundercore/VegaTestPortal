import { FormGroup } from "@angular/forms";

export function MustMatch(g: FormGroup) {

  const control = g.controls['password'];
  const matchingControl = g.controls['confirmPassword'];

  if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return matchingControl.errors;

  }

  // set error on matchingControl if validation fails
  if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return matchingControl.errors;
  } else {
      matchingControl.setErrors(null);
      return matchingControl.errors;
  }

}
