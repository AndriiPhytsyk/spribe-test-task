import {Directive, ElementRef, HostListener, OnInit, Injector} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidationErrors, NgControl, FormControl} from '@angular/forms';
import {Country} from '../shared/enum/country';
import {fromEvent, Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';

@Directive({
  selector: '[appCountryAutocomplete]',
  exportAs: 'appCountryAutocomplete',
  providers: [{provide: NG_VALIDATORS, useExisting: CountryAutocompleteDirective, multi: true}],
  standalone: true
})
export class CountryAutocompleteDirective implements Validator, OnInit {
  private _control: AbstractControl | null = null;
  private ngControl: NgControl | null = null;

  countries = Object.values(Country);
  public suggestions$: Observable<string[]> = of([]);
  private inputElement: HTMLInputElement;

  constructor(private el: ElementRef, private injector: Injector) {
    this.inputElement = this.el.nativeElement as HTMLInputElement;
  }

  ngOnInit() {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
      if (this.ngControl && this.ngControl.control) {
        this._control = this.ngControl.control;
        this.setupAutocomplete();
      }
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return this.countries.includes(value) ? null : {invalidCountry: true};
  }

  private setupAutocomplete() {
    this.suggestions$ = fromEvent(this.inputElement, 'input').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((event: Event) => (event.target as HTMLInputElement).value),
      startWith(this.inputElement.value),
      switchMap(value => this.filterCountries(value)),
    );
    this.suggestions$.subscribe()
  }

  private filterCountries(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      return of([]);
    }
    const filteredCountries = this.countries.filter(country => country.toLowerCase().includes(filterValue));
    return of(filteredCountries);
  }

  @HostListener('blur')
  onBlur() {
    if (this._control) {
      this.validate(this._control);
      this._control.updateValueAndValidity();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this._control) {
      this._control.setValue(input.value);
    }
  }
}
