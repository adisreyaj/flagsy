import { AbstractControl } from '@angular/forms';

export abstract class FormUtil {
  public static hasErrors(
    control: AbstractControl,
    formSubmitted: boolean = false,
  ): boolean {
    if (control.touched && control.dirty) {
      return control.invalid;
    }
    return (
      formSubmitted && (control.touched || control.dirty) && control.invalid
    );
  }
}
