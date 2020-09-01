import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {
	selectedMinute: string;
	selectedHoure: number;
	timepickerActive = false;
	x: number;
	y: number;
	houreList = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
	minuteList = ["00", "15", "30", "45"];
	prevScrollPosition = 0;
	@ViewChild('hourPickerElement') hourPickerElement: ElementRef;
	@Output() timepickerCloseEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }

  getErrorMessage(){
  	return "Zeitspanne belegt oder fehlerhaft";
  }

  getState(){
  	return this.timepickerActive;

  }

  ngAfterViewInit(): void {
  	this.hourPickerElement.nativeElement.scrollTop = 640;
  }

	onScroll(event) {
		if(event.target.scrollTop<=100){
			this.hourPickerElement.nativeElement.scrollTop = event.target.scrollTop+520;
		}
		if(event.target.scrollTop>=1200){
			this.hourPickerElement.nativeElement.scrollTop = event.target.scrollTop-520;
		}
	}
	goUp(){
		if(this.hourPickerElement.nativeElement.scrollTop==120){
			this.hourPickerElement.nativeElement.scrollTop = 600;
		} else {
			this.hourPickerElement.nativeElement.scrollTop-=40;
		}
	}
	goDown(){
		if(this.hourPickerElement.nativeElement.scrollTop==1120){
			this.hourPickerElement.nativeElement.scrollTop = 600;
		} else {
			this.hourPickerElement.nativeElement.scrollTop+=40;
		}
	}

	close(event){
		this.timepickerActive = false;
		this.timepickerCloseEvent.emit([event, this.selectedHoure, this.selectedMinute])
	}

	toggle(event){
		if(this.timepickerActive){
			this.close(event);
		} else {
			this.timepickerActive=true;
			this.x=event.x-90;
			this.y=event.y+30;
		}
	}

}
