import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEventComponent } from './grid-event.component';

describe('GridEventComponent', () => {
  let component: GridEventComponent;
  let fixture: ComponentFixture<GridEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
