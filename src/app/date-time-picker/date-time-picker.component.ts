import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, FormGroupDirective, NgForm, AbstractControl} from '@angular/forms';
import { ViewService } from '../view.service';
import { TimelineService } from '../timeline.service';
import { Event } from '../event.interface';
import * as moment from 'moment';
import {ErrorStateMatcher} from '@angular/material/core';
import {EventService} from '../event.service'

export const invalidTimeSpanValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
		const startTime = control.get('startTime');
		const endTime = control.get('endTime');
		if(startTime.value && endTime.value){
			if(+startTime.value.split(':')[0] > +endTime.value.split(':')[0] || (+startTime.value.split(':')[0] == +endTime.value.split(':')[0] && +startTime.value.split(':')[1] >= +endTime.value.split(':')[1])){
				return {startTimeLarger: true};

			} else {
				return null;
			}
		}
  };

// export function createBookedValidator(events: Event[]): ValidatorFn {
//   return (control: FormGroup): ValidationErrors | null => {
//     const startTime = control.get('startTime').value;
//     const endTime = control.get('endTime').value;
//     const date = control.get('dateField').value;
//     for(let event of events){
//       if(startTime.getTime() <= event.startDate.getTime() && endTime.getTime() > event.startDate.getTime()){
//         return {startTime: false, endTime: true};
//       } else if(startTime.getTime() < event.endDate.getTime() && endTime.getTime() >= event.endDate.getTime()){
//         return {startTime: true, endTime: false};
//       } else if(startTime.getTime() <= event.startDate.getTime() && endTime.getTime() <= event.endDate.getTime()){
//         return {startTime: true, endTime: true};
//       }
//     }
//   };
// }


//   export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//       const forbidden = nameRe.test(control.value);
//       return forbidden ? {booked: {value: control.value}} : null;
//     };
//   }

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     // console.log(form)
//     return control.invalid;
//   }
// }

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {
  onSecondStep = false;
	activeDateTimePicker=false;
	activePageName: string;
	dayName: string;
	date: string;
	month: string;
	year: string;
  columnDatesDic: Date[]
	@Input() selectionRowSpan: {start: number, end: number};
	@Input() selectedDate: Date;
  @Output() addEventEmitter = new EventEmitter();
	formGroup = new FormGroup({
    weekly: new FormControl(''),
    dateField: new FormControl('', [Validators.required]),
		startTime: new FormControl('', [Validators.required, Validators.pattern('([01]?[0-9]|20):(00|15|30|45)')]),
		endTime: new FormControl('', [Validators.required, Validators.pattern('([01]?[0-9]|20):(00|15|30|45)')]),
    title: new FormControl('', [Validators.required]),
    color: new FormControl(''),
    infoText: new FormControl(''),},
		{ validators: invalidTimeSpanValidator });
  // matcher = new MyErrorStateMatcher();
  constructor(private _viewService: ViewService, private _timelineService: TimelineService, private _eventService: EventService) { }

  ngOnInit(): void {

  	this.activePageName = this.getActivePageName();
  }

  @HostListener('document:click', ['$event']) documentClick(event: MouseEvent) {
    if(this.formGroup.get('dateField').value){
      this.formatMoment(this.formGroup.get('dateField').value);
    }
  }

  addEvent(){
    if(!this.formGroup.controls.title.invalid){
      this.addEventEmitter.emit(this.formGroup.value);
      this.closeDateTimePicker();
    } else {
      this.formGroup.controls.title.markAsTouched();
    }
  }

  bookedColission(day: Date, startTime, endTime){
    const events = this._eventService.getEvents(day, this._viewService.getActivePageID());
    if(events){
      for(let event of events){
        const startDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startTime.split(':')[0],  startTime.split(':')[1])
        const endDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), endTime.split(':')[0],  endTime.split(':')[1])
        if(startDate.getTime() <= event.startDate.getTime() && endDate.getTime() > event.startDate.getTime()){
          return true;
        } else if(startDate.getTime() <= event.endDate.getTime() && endDate.getTime() >= event.endDate.getTime()){
          return true;
        } else if(startDate.getTime() <= event.endDate.getTime() && endDate.getTime() > event.endDate.getTime()){
          return true;
        } else {
          return false;
        }
      }
    }
  }

  toSecondStep(){
    this.formGroup.controls.endTime.markAsTouched();
    this.formGroup.controls.startTime.markAsTouched();
    this.formGroup.controls.dateField.markAsTouched();
    if(this.formGroup.errors?.startTimeLarger){
      this.formGroup.controls.endTime.setErrors({startTimeLarger: true});
      this.formGroup.controls.startTime.setErrors({startTimeLarger: true});
    }
    if(this.bookedColission(this.formGroup.controls.dateField.value._d, this.formGroup.controls.startTime.value, this.formGroup.controls.endTime.value)){
      this.formGroup.controls.endTime.setErrors({bookedColission: true});
      this.formGroup.controls.startTime.setErrors({bookedColission: true});
      this.formGroup.controls.dateField.setErrors({bookedColission: true});
    } else if(!this.formGroup.controls.endTime.invalid && !this.formGroup.controls.startTime.invalid && !this.formGroup.controls.dateField.invalid){
      this.onSecondStep = true;
    }
  }

  getErrorMessage(input: FormControl){
    if(input.hasError('required')){
      return 'Benötigtes Feld'
    } else if(input.hasError('pattern')){
      return 'Nur Viertelstündige Uhrzeiten';
    } else if(input.hasError('bookedColission')){
      return 'Bereits Belegt'
    } else if(input.hasError('startTimeLarger')){
      return 'Startzeitpunkt größer Endzeitpunkt'
    }
  }

  updateViewVariables(){
  	this.activePageName = this.getActivePageName();
  }

  clearSelection(){
    this.formGroup.reset();
  }

  getColumnDatesDic(){
    return this._viewService.getColumnDatesDic();
  }

  updateValues(event, source){
  	if(event[1] && event[2] && event[0]){
  		this.formGroup.get(source).setValue(event[1]+':'+event[2])
  	}
  }

  getActivePageName(){
  	return this._viewService.getActivePageName();
  }

  formatMoment(momentArg){
  	if(momentArg){
	  	this.dayName = this._timelineService.getDayName(momentArg._d)
	  	this.month = this._timelineService.getMonthString(momentArg._d)
	  	this.date = this._timelineService.getDateString(momentArg._d)
	  	this.year = momentArg._d.getFullYear().toString();
  	}
  }


  closeDateTimePicker(){
  	this.activeDateTimePicker = false;
    this.onSecondStep = false;

  }

  openDateTimePicker(){
  	this.activeDateTimePicker = true;

  	if(this.selectionRowSpan){
	  	this.formGroup.get('startTime').setValue(this._timelineService.convertRowToTime(this.selectionRowSpan.start));
	  	this.formGroup.get('endTime').setValue(this._timelineService.convertRowToTime(this.selectionRowSpan.end+1));
  	  this.formGroup.get('dateField').setValue(moment(this.selectedDate));
    }
  }

  toggleDateTimePicker(){
  	this.activeDateTimePicker ? this.closeDateTimePicker() : this.openDateTimePicker();
  }

}
