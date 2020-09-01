import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  timelineSettings = {startTime: 8, endTime: 20, timeIncrementPerRow: 0.25};
  dayDic = ["Sonntag", "Montag","Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  monthDic = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  dateDic = ["00","01", "02", "03", "04", "05", "06", "07", "08", "09"];
  timeDic = {"00": 0, "15": 0.25, "30": 0.5, "45": 0.75};

  constructor() { }

  getTimelineSettings(){
  	return this.timelineSettings;
  }

  convertTimeToRow(time: Date) {
  	if(time.getHours() + time.getMinutes()/60 >= this.timelineSettings.startTime &&  time.getHours() + time.getMinutes()/60 <= this.timelineSettings.endTime){
  		return (time.getHours() + time.getMinutes()/60 - this.timelineSettings.startTime)/this.timelineSettings.timeIncrementPerRow;
  	} else {
  		return undefined;
  	}
  }

  convertRowToTime(row: number){
    const numericTime = this.timelineSettings.startTime + this.timelineSettings.timeIncrementPerRow*row
    if(numericTime%1 == 0){
      return (Math.trunc(numericTime)).toString() +':00';
    } else {
      return (Math.trunc(numericTime)).toString() +':'+((numericTime%1)*60).toString();
    }

  }

  getDayName(date: Date): string {
  	return this.dayDic[date.getDay()];
  }

  getMonthString(date: Date): string {
  	return this.monthDic[date.getMonth()];
  }

  getDateString(date: Date): string {
  	if(date.getDate()<10){
  		return this.dateDic[date.getDate()];
  	} else {
  		return date.getDate().toString();
  	}
  }
}
