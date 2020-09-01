import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

	timeline = [];
	gridSettings: {rows: number, cols: number};
  timelineSettings: {startTime: number, endTime: number, timeIncrementPerRow: number};
  constructor(private _timelineService: TimelineService, private _gridService: GridService) { }

  ngOnInit(): void {
  	this.gridSettings = this.getGridSettings();
  	this.timelineSettings = this.getTimelineSettings();
  	this.generateTimeline();
  }

  getGridSettings(){
  	return this._gridService.getGridSettings();
  }

  getTimelineSettings(){
  	return this._timelineService.getTimelineSettings();
  }

  generateTimeline(){
  	const startTime = new Date(2020, 0, 1, this.timelineSettings.startTime, 0);
  	const endTime = new Date(2020, 0, 1, this.timelineSettings.endTime, 0);
  	let i = 0;
  	while(true){
  		const temp = new Date(2020, 0, 1, this.timelineSettings.startTime, 60*2*this.timelineSettings.timeIncrementPerRow*i);
  		i++;
  		if(temp.getTime()> endTime.getTime()){
  			break;
  		}
  		this.timeline.push(temp);

  	}
  }

}
