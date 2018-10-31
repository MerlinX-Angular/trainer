import { inject, fakeAsync, async, tick, TestBed, discardPeriodicTasks, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { WorkoutPlan, ExercisePlan, Exercise } from '../core/model';
import { WorkoutRunnerComponent } from './workout-runner.component';
import { SecondsToTimePipe } from '../shared/seconds-to-time.pipe';
import { WorkoutService } from '../core/workout.service';
import { WorkoutHistoryTrackerService } from '../core/workout-history-tracker.service';

// sukuriame fiktyvią klasę su tuščiomis funkcijomis
class MockWorkoutHistoryTracker {
    startTracking() {}
    endTracking() {}
    exerciseComplete() {}
}

// sukuriame fiktyvų servisą su fiktyviais duomenimis
class MockWorkoutService {
    sampleWorkout = new WorkoutPlan(
         'testworkout',
         'Test Workout',
          40,
          [
            new ExercisePlan(new Exercise( 'exercise1', 'Exercise 1', 'Exercise 1 description',  '/image1/path',  'audio1/path'), 50),
            new ExercisePlan(new Exercise( 'exercise1', 'Exercise 2', 'Exercise 2 description',  '/image2/path',  'audio2/path'), 30),
            new ExercisePlan(new Exercise( 'exercise1', 'Exercise 3', 'Exercise 3 description',  '/image3/path',  'audio3/path'), 20)
          ],
          'This is a test workout'
    );

    getWorkout(name: string) {
        // funkcija grąžina Observable, naudojame of
        return of(this.sampleWorkout);
    }
    totalWorkoutDuration() {
        return 180;
    }
}

// sukuriame fiktyvų rauterį su navigacijos sekimu
export class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('WorkoutRunnerComponent', () => {
    let component: WorkoutRunnerComponent;
    let fixture: ComponentFixture<WorkoutRunnerComponent>;

    beforeEach( async(() => {
        TestBed
            .configureTestingModule({
                declarations: [ WorkoutRunnerComponent, SecondsToTimePipe ],
                providers: [
                    {provide: Router, useClass: MockRouter},
                    {provide: WorkoutHistoryTrackerService, useClass: MockWorkoutHistoryTracker},
                    {provide: WorkoutService, useClass: MockWorkoutService}
                ],
                // testuojame tik patį komponentą be jo priklausomybių
                schemas: [ NO_ERRORS_SCHEMA ]
            })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(WorkoutRunnerComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should instantiate the Workout Runner Component', () => {
      // instanceof tikriname objekto tipą(grąžina false arba true)
        expect(component instanceof WorkoutRunnerComponent).toBe(true, 'should create WorkoutRunnerComponent');
    });

    it('should start the workout', () => {
        // tikriname ar yra savybė workoutPlan kai įvyksta EventEmitter
        component.workoutStarted.subscribe((w: any) => {
          expect(w).toEqual(component.workoutPlan);
        });
        // pajungiame metodus ngOnInit() ir ngDoCheck()
        component.ngOnInit();
        component.ngDoCheck();
        // tikriname ar pasileidžia treniruotė kai užsikrauna komponentas
        expect(component.workoutTimeRemaining).toEqual(component.workoutPlan.totalWorkoutDuration());
        expect(component.workoutPaused).toBeFalsy();
    });

    // testuojame ar pasileidžia pirma treniruotė
    it('should start the first exercise', () => {
        // spyOn perima kiekvienos funkcijos iškvietimus, kuriuos seka
        spyOn(component, 'startExercise').and.callThrough();
        component.ngOnInit();
        component.ngDoCheck();
        // iškviečiamas pirmas pratimas
        expect(component.currentExerciseIndex).toEqual(0);
        // ar buvo iškvietas metodas kai prasidėjo treniruotė, ir ar buvo perduoti teisingi parametrai
        expect(component.startExercise).toHaveBeenCalledWith(component.workoutPlan.exercises[component.currentExerciseIndex]);
        expect(component.currentExercise).toEqual(component.workoutPlan.exercises[0]);
    });

    it('should start history tracking', inject([WorkoutHistoryTrackerService], (tracker: WorkoutHistoryTrackerService) => {
        // tikriname ar buvo iškviestas metodas startTracking
        spyOn(tracker, 'startTracking');
        component.ngOnInit();
        component.ngDoCheck();
        expect(tracker.startTracking).toHaveBeenCalled();
    }));

    // fakeAsync leidžia paleisti asinchroninį kodą sinchroniškai
    it('should increase current exercise duration with time', fakeAsync(() => {
        component.ngOnInit();
        component.ngDoCheck();
        expect(component.exerciseRunningDuration).toBe(0);
        // pagreitina darbą, nereikia laukti nurodyto laiko pabaigos
        tick(1000);
        expect(component.exerciseRunningDuration).toBe(1);
        tick(1000);
        expect(component.exerciseRunningDuration).toBe(2);
        tick(8000);
        expect(component.exerciseRunningDuration).toBe(10);
        // išvalome visus taimerius
        discardPeriodicTasks();
    }));

    it('should decrease total workout duration with time', fakeAsync(() => {
        component.ngOnInit();
        component.ngDoCheck();
        expect(component.workoutTimeRemaining).toBe(component.workoutPlan.totalWorkoutDuration());
        tick(1000);
        expect(component.workoutTimeRemaining).toBe(component.workoutPlan.totalWorkoutDuration() - 1);
        tick(1000);
        expect(component.workoutTimeRemaining).toBe(component.workoutPlan.totalWorkoutDuration() - 2);
        discardPeriodicTasks();
    }));

    // tikriname ar pereinama teisingai nuo vieno pratimo prie kito
    it('should transition to next exercise on one exercise complete', fakeAsync(() => {
        component.ngOnInit();
        component.ngDoCheck();
        const exerciseDuration = component.workoutPlan.exercises[0].duration;
        TestHelper.advanceWorkout(exerciseDuration);
        // tikriname ar esame pertraukoje
        expect(component.currentExercise.exercise.name).toBe('rest');
        // ar turime perėjimą po pirmo pratimo
        expect(component.currentExercise.duration).toBe(component.workoutPlan.restBetweenExercise);
        discardPeriodicTasks();
    }));

    it('should not update workoutTimeRemaining for paused workout on interval lapse', fakeAsync(() => {
        component.ngOnInit();
        component.ngDoCheck();
        // tikriname ar treniruotė neprasideda nuo pertraukos
        expect(component.workoutPaused).toBeFalsy();
        tick(1000);
        expect(component.workoutTimeRemaining).toBe(component.workoutPlan.totalWorkoutDuration() - 1);
        // sustabdome vienai sekundei
        component.pause();
        expect(component.workoutPaused).toBe(true);
        tick(1000);
        // tikriname ar treniruotės laikas nepasikeičia po įvykusios pertraukos
        expect(component.workoutTimeRemaining).toBe(component.workoutPlan.totalWorkoutDuration() - 1);
        discardPeriodicTasks();
    }));

    it('should end the workout when all exercises are complete',
     inject([WorkoutHistoryTrackerService, Router], <any>fakeAsync(( tracker: WorkoutHistoryTrackerService, router: Router) =>  {
        spyOn(tracker, 'endTracking');
        component.ngOnInit();
        component.ngDoCheck();
        component.workoutName = component.workoutPlan.name;
        TestHelper.advanceWorkout(component.workoutPlan.exercises[0].duration);
        TestHelper.advanceWorkout(component.workoutPlan.restBetweenExercise);
        TestHelper.advanceWorkout(component.workoutPlan.exercises[1].duration);
        TestHelper.advanceWorkout(component.workoutPlan.restBetweenExercise);
        TestHelper.advanceWorkout(component.workoutPlan.exercises[2].duration);
        expect(tracker.endTracking).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/finish']);
        expect(component.workoutTimeRemaining).toBe(0);
        expect(component.currentExercise).toBe(component.workoutPlan.exercises[2]);
        discardPeriodicTasks();
    })));
});

// paslenkame taimerį per vieną sekundę
class TestHelper {
    static advanceWorkout(duration: number) {
        for (let i = 0; i <= duration; i++) {
           tick(1000);
        }
    }
}




