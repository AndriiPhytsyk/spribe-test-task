import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormControl
} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { UsernameValidatorDirective } from '../../directives/username-validator.directive';
import { TimerComponent } from '../timer/timer.component';
import {CountryAutocompleteDirective} from "../../directives/country-validator.directive";
import {BirthdayValidatorDirective} from "../../directives/birthday-validator.directive";
import {TooltipDirective} from "../../directives/tooltip.directive";
import {FormService} from "../../services/form.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    TimerComponent,
    CountryAutocompleteDirective,
    UsernameValidatorDirective,
    BirthdayValidatorDirective,
    TooltipDirective
  ],
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  formArray: FormArray;
  isSubmitting = false;
  timerDuration: number = 0;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.formArray = this.fb.array([]);
  }

  ngOnInit() {
    this.addForm();
  }

  get formGroups(): FormGroup[] {
    return this.formArray.controls as FormGroup[];
  }

  get tooltipText(): string {
    return  this.isSubmitting ? 'Cancel the submission' : 'Submit all forms';
  }

  addForm() {
    if (this.formArray.length < 10) {
      this.formArray.push(this.createFormGroup());
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required]],
      username: ['', [Validators.required]],
      birthday: ['', Validators.required]
    });
  }

  markAllAsTouched() {
    this.formArray.controls.forEach(control => {
      const group = control as FormGroup;
      Object.keys(group.controls).forEach(controlName => {
        group.get(controlName)?.markAsTouched();
      });
    });
  }

  submitAllForms() {
    if (this.isSubmitting) {
      this.cancelSubmission();
    } else {
      if (this.formArray.invalid) {
        this.markAllAsTouched();
        return;
      }
      this.isSubmitting = true;
      this.formArray.disable();
      this.timerDuration = 10;
    }
  }

  cancelSubmission() {
    this.isSubmitting = false;
    this.timerDuration = 0;
    this.formArray.enable();
  }

  submitForms() {
    const formsData = this.formArray.value;
    this.formService.submitForm(formsData).subscribe(() => {
      this.formArray.clear();
      this.addForm();
      this.isSubmitting = false;
      this.timerDuration = 0;
    })
  }

  selectCountry(suggestions: Subject<string[]>, formControl: AbstractControl | null, country: string) {
    if (formControl instanceof FormControl) {
      formControl.setValue(country);
    }
    suggestions.next([]);
  }

}
