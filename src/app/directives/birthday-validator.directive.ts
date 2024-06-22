import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appBirthdayValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => BirthdayValidatorDirective), multi: true }
  ],
  standalone: true
})
export class BirthdayValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value) {
      const currentDate = new Date();
      const birthday = new Date(value);
      if (birthday > currentDate) {
        return { invalidBirthday: true };
      }
    }
    return null;
  }
}
