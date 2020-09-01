import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { GridComponent } from './grid/grid.component';
import { SelectionBoxComponent } from './selection-box/selection-box.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { AddButtonComponent } from './add-button/add-button.component';
import {MatIconModule} from '@angular/material/icon';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { EventComponent } from './event/event.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { GridEventComponent } from './grid-event/grid-event.component';
import { EventInfoFormComponent } from './event-info-form/event-info-form.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import localeDe from '@angular/common/locales/de';
import { TimelineComponent } from './timeline/timeline.component';
registerLocaleData(localeDe);


export const DateFormats = {
        parse: {
            dateInput: ['DD-MM-YYYY']
        },
        display: {
            dateInput: 'DD-MM-YYYY',
            monthYearLabel: 'MMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY',
        },
    };

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    GridComponent,
    SelectionBoxComponent,
    PaginatorComponent,
    AddButtonComponent,
    DateTimePickerComponent,
    TimepickerComponent,
    EventComponent,
    GridEventComponent,
    EventInfoFormComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatSelectModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRippleModule,
  ],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
          { provide: MAT_DATE_FORMATS, useValue: DateFormats },
          { provide: LOCALE_ID, useValue: "de-de" },],
  bootstrap: [AppComponent]
})
export class AppModule {}
