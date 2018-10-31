import { Directive } from '@angular/core';
import { AsyncValidator, ValidationErrors, NG_ASYNC_VALIDATORS, AbstractControl } from '@angular/forms';
import { WorkoutService } from '../core/workout.service';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';


@Directive({
  selector: '[appUniqueName]',
  // validator registravimui naudojame FormControl, todėl papildomai pridedame šią konfigūraciją
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueNameValidatorDirective, multi: true }]
})
export class UniqueNameValidatorDirective implements AsyncValidator {

  constructor(private workoutService: WorkoutService) { }

  validate(c: AbstractControl): Observable<ValidationErrors | null> {
    return this.workoutService.getByUniqueName(c.value).pipe(
      map(users => {
          return (users && users.length > 0) ? {'appUniqueName': true} : null;
      })
    );
  }

}
