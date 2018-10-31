import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Exercise } from '../../core/model';
import { WorkoutService } from '../../core/workout.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styles: []
})
export class ExercisesComponent implements OnInit {
  exerciseList: Observable<Exercise[]>;
  errorMessage: any;

  constructor(
    private router: Router,
    private workoutService: WorkoutService) {}

  ngOnInit() {
    this.exerciseList = this.workoutService.getExercises();
  }

  onSelect(exercise: Exercise) {
      this.router.navigate(['./builder/exercise', exercise.name]);
  }
}
