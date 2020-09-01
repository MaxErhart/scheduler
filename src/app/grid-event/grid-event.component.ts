import { Component, OnInit, Input, HostListener, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Event } from '../event.interface';
import { GridItem } from '../GridItem.interface';
import { EventService } from '../event.service';
import { ViewService } from '../view.service';
import { TimelineService } from '../timeline.service';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-grid-event',
  templateUrl: './grid-event.component.html',
  styleUrls: ['./grid-event.component.scss']
})
export class GridEventComponent implements OnInit {

	eventActive = false;
  eventPosition: {left: number, top: number, height: number};
  eventPosActive = {left: window.innerWidth/2, top: document.documentElement.scrollTop + window.innerHeight/4};
	@Input() event: Event;
	@Input() gridBasis: {x: number, y: number, height: number, width: number};
  @Input() offset: number;
  @Output() deleteEventEmitter = new EventEmitter<number>()
  constructor(private _eventService: EventService, private _viewService: ViewService, private _timelineService: TimelineService, private _gridService: GridService) { }

  @HostListener('document:scroll', ['$event']) documentScroll(event: MouseEvent) {
    this.eventPosActive.top = document.documentElement.scrollTop + window.innerHeight/4;
  }

  @HostListener('document:click', ['$event']) documentClick(event: MouseEvent) {

  }

  ngOnInit(): void {
    this.reloadEvent();
  }

  ngOnChanges(changes) {
  	this.eventPosition = this.eventRowSpan(this.event, changes.gridBasis.currentValue);
  }

  reloadEvent(){
    this.eventPosition = this.eventRowSpan(this.event, this.gridBasis);
  }

  eventRowSpan(event, gridBasis){
    if(gridBasis){
      const rowStart = this._timelineService.convertTimeToRow(event.startDate)
      const rowEnd = this._timelineService.convertTimeToRow(event.endDate)
      return {left: gridBasis.x + this.offset, top: gridBasis.height*rowStart, height: gridBasis.height*(rowEnd-rowStart)}
    }
    return undefined;
  }

  deleteEvent(eventID){
    this.deleteEventEmitter.emit(eventID)
  }

}
