import { Component, OnInit, Input, HostListener, OnChanges, AfterViewInit } from '@angular/core';
import { Event } from '../event.interface';
import { GridItem } from '../GridItem.interface';
import { EventService } from '../event.service';
import { ViewService } from '../view.service';
import { TimelineService } from '../timeline.service';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

	eventActive = false;
  eventPosition: {top: number, height: number};
  eventPosActive = {top: document.documentElement.scrollTop + window.innerHeight/4};
	@Input() event: Event;
  constructor(private _eventService: EventService, private _viewService: ViewService, private _timelineService: TimelineService, private _gridService: GridService) { }



  @HostListener('document:click', ['$event']) documentClick(event: MouseEvent) {
    console.log(document.documentElement.scrollTop, window.innerHeight)
  }

  @HostListener('document:scroll', ['$event']) documentScroll(event: MouseEvent) {
    this.eventPosActive = {top: document.documentElement.scrollTop + window.innerHeight/4};
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.event){
        this.eventPosition = this.eventRowSpan(this.event);
      }
    }, 10)

  }

  getAllEvents(){
  	return this._eventService.getAllEvents();
  }

  eventRowSpan(event){
    const gridBasis = this._gridService.getGridBasis();
    if(gridBasis){
      const rowStart = this._timelineService.convertTimeToRow(event.startDate)
      const rowEnd = this._timelineService.convertTimeToRow(event.endDate)
      return {top: gridBasis.y + gridBasis.height*rowStart, height: gridBasis.height*rowEnd}

    }
    return undefined;
  }

}
