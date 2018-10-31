import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WorkoutRunnerModule } from './workout-runner/workout-runner.module';
import { StartComponent } from './start/start.component';
import { FinishComponent } from './finish/finish.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { WorkoutHistoryComponent } from './workout-history/workout-history.component';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from '@angular/fire';

export const firebaseConfig = {
apiKey: "AIzaSyAxTz6T_b37RsKnLS6MHQzRf-bvCXbF5PY",
authDomain: "trainer-2d644.firebaseapp.com",
databaseURL: "https://trainer-2d644.firebaseio.com",
projectId: "trainer-2d644",
storageBucket: "trainer-2d644.appspot.com",
messagingSenderId: "1030818748538"

};

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    FinishComponent,
    WorkoutHistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    WorkoutRunnerModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }