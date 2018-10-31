import { TestBed, inject } from '@angular/core/testing';

import { WorkoutResolver } from './workout.resolver';
import { WorkoutBuilderService } from '../builder-services/workout-builder.service';
import { WorkoutService } from '../../core/workout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('WorkoutResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ WorkoutResolver,  WorkoutBuilderService, WorkoutService ]
    });
  });

  it('should be created', inject([WorkoutResolver], (service: WorkoutResolver) => {
    expect(service).toBeTruthy();
  }));
});
