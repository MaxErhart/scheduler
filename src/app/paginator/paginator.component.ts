import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ViewService } from '../view.service'
import { TimelineService } from '../timeline.service'

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

	columnDatesDic: Date[]
	columnDateString: {dayName: string, date: string, month: string, year: string}[] = [];
	@Output() paginatorEvent = new EventEmitter<number>();
  constructor(private _viewService: ViewService, private _timelineService: TimelineService) { }

  ngOnInit(): void {
  	this.columnDatesDic = this.getColumnDatesDic();
  	this.columnDateString = [this.formatDateToString(this.columnDatesDic[0])]
  }

  setColumnDatesDic(datesDic){
  	return this._viewService.setColumnDatesDic(datesDic);
  }

  getColumnDatesDic(){
  	return this._viewService.getColumnDatesDic();
  }

  formatDateToString(date){
  	return {dayName: this._timelineService.getDayName(date), date: this._timelineService.getDateString(date), month: this._timelineService.getMonthString(date), year: date.getFullYear().toString()}
  }

  changePage(DateIncrement){
  	this.columnDatesDic[0].setDate(this.columnDatesDic[0].getDate()+DateIncrement);
  	this.columnDateString = [this.formatDateToString(this.columnDatesDic[0])]
  	this.setColumnDatesDic(this.columnDatesDic);
  	this.paginatorEvent.emit(DateIncrement);
  }


  createColumnDatesDic(){
    const today = new Date()
    let dateArr = [];
    for(let offset=0-today.getDay()+1;offset<7-today.getDay()+1; offset++){
      let temp = new Date();
      temp.setDate(today.getDate()+offset)
      dateArr.push(temp)
    }
  }

}
