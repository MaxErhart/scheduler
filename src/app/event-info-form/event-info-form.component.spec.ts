import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoFormComponent } from './event-info-form.component';

describe('EventInfoFormComponent', () => {
  let component: EventInfoFormComponent;
  let fixture: ComponentFixture<EventInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
