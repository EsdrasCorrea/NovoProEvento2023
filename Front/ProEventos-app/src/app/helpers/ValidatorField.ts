import { AbstractControl, FormGroup } from '@angular/forms';

export class ValidatorField {
  static MustMatch(controName: string, matchingControName: string): any {
    return(group: AbstractControl) => {
      const formGroup = group as FormGroup;
      const control = formGroup.controls[controName];
      const matchingControl = formGroup.controls[matchingControName];

      if(matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
      }

      if(control.value !== matchingControl.value){
        matchingControl.setErrors({mustMatch: true});
      }else {
        matchingControl.setErrors(null);
      }

      return null;
    };
  }
}
