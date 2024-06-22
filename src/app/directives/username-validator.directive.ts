import { Directive } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors, AsyncValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap, first } from 'rxjs/operators';
import {FormService} from "../services/form.service";

@Directive({
  selector: '[appUsernameValidator]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true }],
  standalone: true
})
export class UsernameValidatorDirective implements AsyncValidator {
  constructor(private formService: FormService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.formService.checkUsernameAvailability(value)),
      map(response => (response.isAvailable ? null : { isNotAvailable: true })),
      first()
    );
  }
}
