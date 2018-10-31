import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByPipe } from './order-by.pipe';
import { SearchPipe } from './search.pipe';
import { MyAudioDirective } from './my-audio.directive';
import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { UniqueNameValidatorDirective } from './uniqueName-validator.directive';
import { BusyIndicatorDirective } from './busy-indicator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    OrderByPipe,
    SecondsToTimePipe,
    SearchPipe,
    MyAudioDirective,
    UniqueNameValidatorDirective,
    BusyIndicatorDirective
  ],
  exports: [
    OrderByPipe,
    SecondsToTimePipe,
    SearchPipe,
    MyAudioDirective,
    UniqueNameValidatorDirective,
    BusyIndicatorDirective
  ]
})
export class SharedModule { }

