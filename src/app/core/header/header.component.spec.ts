import { async, ComponentFixture, TestBed,  inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { HeaderComponent } from './header.component';

@Component({
  template: ''
})
class MockHistoryComponent {
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: any;
  let el: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, MockHistoryComponent ],
      imports: [
        RouterTestingModule.withRoutes([
         { path: 'history', component: MockHistoryComponent }
        ])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title "Personal Trainer" in a h3 tag', () => {
    de = fixture.debugElement.query(By.css('h3'));
    el = de.nativeElement;
    expect(el.innerText).toEqual('Personal Trainer');
  });

  it('should have a link to /history', () => {
    de = fixture.debugElement.query(By.css('a'));
    el = de.nativeElement.getAttribute('href');
    expect(el).toEqual('/history');
  });

  it('should navigate to "/history" when clicking on link',
    async(inject([Location], (location: Location) => {
     de = fixture.debugElement.query(By.css('a'));
     el = de.nativeElement.click();
     // testas sustabdomas, kol neįvydomos prieš tai nurodytos sąlygos
     fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/history');
     });
  })));


});
