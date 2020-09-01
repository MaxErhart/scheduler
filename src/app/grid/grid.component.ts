import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, HostListener, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { GridItem } from '../gridItem.interface'
import { GridService } from '../grid.service'
import { SelectionBox } from '../selectionBox.interface'
import { Event } from '../event.interface'
import { EventService } from '../event.service'
import { TimelineService } from '../timeline.service'
import { ViewService } from '../view.service'
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  animations: [
    trigger('pageRight', [
      state(
        'step0',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
          // visibility: 'hidden',
          display: 'none',
        })
      ),
      state(
        'step1',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
          display: 'none',
        })
      ),
      state(
        'step2',
        style({
          transform: 'translateX(0%)',
          opacity: 1,
          display: 'grid',
        })
      ),


      transition('step2 => step1', animate('800ms ease-out')),
      transition('step2 => step0', animate('800ms ease-out')),
      transition('step0 => step2', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),
      transition('step1 => step2', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(-100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),

    ]),
    trigger('pageMiddle', [
      state(
        'step0',
        style({
          transform: 'translateX(0%)',
          opacity: 1,
          display: 'grid',
          // visibility: 'visible',
        })
      ),
      state(
        'step1',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
          // visibility: 'hidden',
          display: 'none',
        })
      ),
      state(
        'step2',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
          // visibility: 'hidden',
          display: 'none',
        })
      ),
      transition('step0 => step1', animate('800ms ease-out')),
      transition('step0 => step2', animate('800ms ease-out')),
      transition('step2 => step0', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(-100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),
      transition('step1 => step0', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),


    ]),
    trigger('pageLeft', [
      state(
        'step0',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
          // visibility: 'hidden',
          display: 'none',
        })
      ),
      state(
        'step1',
        style({
          transform: 'translateX(0%)',
          opacity: 1,
          // visibility: 'visible',
          // display: 'none',
        })
      ),
      state(
        'step2',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
          // visibility: 'hidden',
          display: 'none',
        })
      ),
      transition('step1 => step0', animate('800ms ease-out')),
      transition('step1 => step2', animate('800ms ease-out')),
      transition('step0 => step1', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(-100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),
      transition('step2 => step1', animate('800ms ease-out', keyframes([
        style({display: 'grid', transform: 'translateX(100%)', opacity: 0, offset: 0}),
         style({display: 'grid', transform: 'translateX(0%)', opacity: 1, offset: 1})]))),
    ]),
  ]
})
export class GridComponent implements OnInit {
  step = 'step0';
  touchStartEvent: TouchEvent;
	gridItems: GridItem[][];
  firstSelectedItem: GridItem;
  selectionRowSpan: {start: number, end: number};
	gridSettings: {rows: number, cols: number};
  viewSettings: [];
  gridBasis: {x: number, y: number, height: number, width: number};
  gridBasisPrev: {x: number, y: number, height: number, width: number};
  gridBasisNext: {x: number, y: number, height: number, width: number};

  events: Event[];
  nextPageEvents: Event[];
  prevPageEvents: Event[];
  selectionBoundaries: {min: number, max: number};
  activePageID: number;
  columnDatesDic: Date[];
  selectedDate: Date;

  @Output() clearSelectionEmitter = new EventEmitter();
  @Output() gridMouseDownEmitter = new EventEmitter();
  @ViewChild('gridBody') gridBodyElement: ElementRef;
  @ViewChild('gridBodyBefore') gridBodyBeforeElement: ElementRef;
  @ViewChild('gridBodyAfter') gridBodyAfterElement: ElementRef;
  @ViewChild('eventMiddle') eventMiddle: ElementRef;
  @ViewChild('eventBefore') eventBefore: ElementRef;
  @ViewChild('eventAfter') eventAfter: ElementRef;


  @HostListener('window:resize', ['$event']) documentResize(event) {
    this.gridBasis = this.calcGridBasis(this.gridBodyElement.nativeElement, this.gridSettings);
    this.gridBasisPrev = this.calcGridBasis(this.gridBodyBeforeElement.nativeElement, this.gridSettings);
    this.gridBasisNext = this.calcGridBasis(this.gridBodyAfterElement.nativeElement, this.gridSettings);
    this._gridService.setGridBasis(this.gridBasis);
  }

  @HostListener('document:mousemove', ['$event']) documentMouseMove(event: MouseEvent) {
    // console.log(event)
  }

  @HostListener('document:touchstart', ['$event']) documentTouchStart(event: TouchEvent) {
    this.touchStartEvent = event;
  }

  @HostListener('document:touchmove', ['$event']) documentTouchMove(event: TouchEvent) {
  }

  @HostListener('document:mouseup', ['$event']) documentMouseUp(event: MouseEvent) {
    delete this.firstSelectedItem;
  }

  selectRow(event){
    if(event.timeStamp - this.touchStartEvent.timeStamp < 200){
      const p1 = this.getGridMatrixIndices(this.gridBasis, {x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY})

      if(!this.gridItems[p1.row][p1.col].booked){
        if(this.selectionRowSpan){

          if(p1.row - 1 == this.selectionRowSpan.end || p1.row - 2 == this.selectionRowSpan.end){
            this.selectionRowSpan.end += 1;
            this.gridItems[this.selectionRowSpan.end][p1.col].selected = true;
            this.selectionRowSpan.end += 1;
            this.gridItems[this.selectionRowSpan.end][p1.col].selected = true;
          } else if(p1.row + 1 == this.selectionRowSpan.start || p1.row + 2 == this.selectionRowSpan.start){
            this.selectionRowSpan.start -= 1;
            this.gridItems[this.selectionRowSpan.start][p1.col].selected = true;
            this.selectionRowSpan.start -= 1;
            this.gridItems[this.selectionRowSpan.start][p1.col].selected = true;
          } else if (p1.row == this.selectionRowSpan.end || p1.row + 1 == this.selectionRowSpan.end){
            this.gridItems[this.selectionRowSpan.end][p1.col].selected = false;
            this.selectionRowSpan.end -= 1;
            this.gridItems[this.selectionRowSpan.end][p1.col].selected = false;
            this.selectionRowSpan.end -= 1;
            if(this.selectionRowSpan.end <= this.selectionRowSpan.start){
              delete this.selectionRowSpan;
            }
          } else if (p1.row == this.selectionRowSpan.start || p1.row - 1 == this.selectionRowSpan.start){
            this.gridItems[this.selectionRowSpan.start][p1.col].selected = false;
            this.selectionRowSpan.start += 1;
            this.gridItems[this.selectionRowSpan.start][p1.col].selected = false;
            this.selectionRowSpan.start += 1;
          }
        } else {
          if(p1.row % 2 == 0){
            this.gridItems[p1.row][p1.col].selected = true;
            this.gridItems[p1.row + 1][p1.col].selected = true;
            this.selectionRowSpan={start: p1.row, end: p1.row +1};
          } else {
            this.gridItems[p1.row - 1][p1.col].selected = true;
            this.gridItems[p1.row][p1.col].selected = true;
            this.selectionRowSpan={start: p1.row - 1, end: p1.row};
          }
        }
      }
    }

  }

  @HostListener('document:click', ['$event']) documentClick(event: MouseEvent) {

  }

  constructor(private _gridService: GridService, private _eventService: EventService, private _timelineService: TimelineService, private _viewService: ViewService) { }

  ngOnInit(): void {
    this.activePageID = this.getActivePageID();
  	this.gridSettings = this.getGridSettings();
  	this.gridItems = this.createNewGrid(this.gridSettings.rows, this.gridSettings.cols);
    this.columnDatesDic = this.getColumnDatesDic();

    this.events = this.getEvents(this.columnDatesDic[0], this.activePageID);
    this.columnDatesDic[0].setDate(this.columnDatesDic[0].getDate()+1)
    this.nextPageEvents = this.getEvents(this.columnDatesDic[0], this.activePageID);
    this.columnDatesDic[0].setDate(this.columnDatesDic[0].getDate()-2)
    this.prevPageEvents =  this.getEvents(this.columnDatesDic[0], this.activePageID);
    this.columnDatesDic[0].setDate(this.columnDatesDic[0].getDate()+1)
    this.setBookedItems(this.events);
  }

  ngAfterViewInit(): void {
    this.gridBasis = this.calcGridBasis(this.gridBodyElement.nativeElement, this.gridSettings);
    this.gridBasisPrev = this.calcGridBasis(this.gridBodyBeforeElement.nativeElement, this.gridSettings);
    this.gridBasisNext = this.calcGridBasis(this.gridBodyAfterElement.nativeElement, this.gridSettings);
    this._gridService.setGridBasis(this.gridBasis);
  }

  gridMouseDown(event){
    this.gridMouseDownEmitter.emit(event)
  }

  addEvent(event){
    const startDate = new Date(event.dateField._d.toString().replace(/[0-2][0-9]:[0-5][0-9]:[0-9][0-9]/, event.startTime + ':00'))
    const endDate = new Date(event.dateField._d.toString().replace(/[0-2][0-9]:[0-5][0-9]:[0-9][0-9]/, event.endTime + ':00'))
    if(!event.color){
      event.color = '#6300ee';
    }
    if(+('0x'+event.color.substring(1, 3)) + +('0x'+event.color.substring(3, 5)) + +('0x'+event.color.substring(5, 7)) > +'0x63 ' + +'0x00' + +'0xee'){
      this._eventService.addEvent(startDate, endDate, this.activePageID, 'Max', event.title, event.infoText, {background: event.color, text: 'black'}, event.weekly)
    } else {
      this._eventService.addEvent(startDate, endDate, this.activePageID, 'Max', event.title, event.infoText, {background: event.color, text: 'white'}, event.weekly)
    }
    this.updateViewVariables();
  }

  print(str){
    console.log(str)
  }

  paginatorEvent(event){
    const current = this.columnDatesDic[0];
    let prev = new Date(this.columnDatesDic[0].toDateString());
    let next = new Date(this.columnDatesDic[0].toDateString());
    prev.setDate(current.getDate() - 1);
    next.setDate(current.getDate() + 1);
    delete this.prevPageEvents;
    delete this.events;
    delete this.nextPageEvents;
    if(event>0){
      if(this.step == 'step0'){
        this.gridBodyAfterElement.nativeElement.style.zIndex = -1;
        this.gridBodyElement.nativeElement.style.zIndex = 0
        this.gridBodyBeforeElement.nativeElement.style.zIndex = 1;
        this.step = 'step2';
        this.prevPageEvents = this.getEvents(next, this.activePageID);
        this.events = this.getEvents(prev, this.activePageID);
        this.nextPageEvents = this.getEvents(current, this.activePageID);
        this.setBookedItems(this.nextPageEvents);

      } else if(this.step == 'step1') {
        this.gridBodyAfterElement.nativeElement.style.zIndex = 0;
        this.gridBodyElement.nativeElement.style.zIndex = 1
        this.gridBodyBeforeElement.nativeElement.style.zIndex = -1;


        this.step = 'step0';
        this.prevPageEvents = this.getEvents(prev, this.activePageID);
        this.events = this.getEvents(current, this.activePageID);
        this.nextPageEvents = this.getEvents(next, this.activePageID);
        this.setBookedItems(this.events);


      } else if(this.step == 'step2') {
        this.gridBodyAfterElement.nativeElement.style.zIndex = 1;
        this.gridBodyElement.nativeElement.style.zIndex = -1
        this.gridBodyBeforeElement.nativeElement.style.zIndex = 0;

        this.step = 'step1';
        this.prevPageEvents = this.getEvents(current, this.activePageID);
        this.events = this.getEvents(next, this.activePageID);
        this.nextPageEvents = this.getEvents(prev, this.activePageID);
        this.setBookedItems(this.prevPageEvents);

      }
    } else if(event < 0){
      if(this.step == 'step0'){
        this.gridBodyAfterElement.nativeElement.style.zIndex = 1;
        this.gridBodyElement.nativeElement.style.zIndex = 0
        this.gridBodyBeforeElement.nativeElement.style.zIndex = -1;

        this.step = 'step1';
        this.prevPageEvents = this.getEvents(current, this.activePageID);
        this.events = this.getEvents(next, this.activePageID);
        this.nextPageEvents = this.getEvents(prev, this.activePageID);
        this.setBookedItems(this.prevPageEvents);


      } else if(this.step == 'step1') {
        this.gridBodyAfterElement.nativeElement.style.zIndex = 0;
        this.gridBodyElement.nativeElement.style.zIndex = -1
        this.gridBodyBeforeElement.nativeElement.style.zIndex = 1;

        this.step = 'step2';
        this.prevPageEvents = this.getEvents(next, this.activePageID);
        this.events = this.getEvents(prev, this.activePageID);
        this.nextPageEvents = this.getEvents(current, this.activePageID);
        this.setBookedItems(this.nextPageEvents);


      } else if(this.step == 'step2') {
        this.gridBodyAfterElement.nativeElement.style.zIndex = -1;
        this.gridBodyElement.nativeElement.style.zIndex = 1
        this.gridBodyBeforeElement.nativeElement.style.zIndex = 0;

        this.step = 'step0';
        this.prevPageEvents = this.getEvents(prev, this.activePageID);
        this.events = this.getEvents(current, this.activePageID);
        this.nextPageEvents = this.getEvents(next, this.activePageID);
        this.setBookedItems(this.events);
      }
    } else {
      if(this.step == 'step0'){

        this.prevPageEvents = this.getEvents(prev, this.activePageID);
        this.events = this.getEvents(current, this.activePageID);
        this.nextPageEvents = this.getEvents(next, this.activePageID);
        this.setBookedItems(this.events);


      } else if(this.step == 'step1') {

        this.prevPageEvents = this.getEvents(current, this.activePageID);
        this.events = this.getEvents(next, this.activePageID);
        this.nextPageEvents = this.getEvents(prev, this.activePageID);
        this.setBookedItems(this.prevPageEvents);

      } else if(this.step == 'step2') {


        this.prevPageEvents = this.getEvents(next, this.activePageID);
        this.events = this.getEvents(prev, this.activePageID);
        this.nextPageEvents = this.getEvents(current, this.activePageID);
        this.setBookedItems(this.nextPageEvents);
      }
    }
  }

  updateViewVariables(){
    this.activePageID = this.getActivePageID();
    delete this.gridItems;
    this.columnDatesDic = this.getColumnDatesDic();
    this.gridItems = this.createNewGrid(this.gridSettings.rows, this.gridSettings.cols);
    this.paginatorEvent(null)

  }

  deleteEvent(eventID: number){
    this._eventService.deleteEvent(eventID);
    for(let index=0; index<this.events.length; index++){
      if(this.events[index].id==eventID){
        this.events.splice(index, 1);
      }
    }
    this.setBookedItems(this.events);
  }



  getActivePageID(){
    return this._viewService.getActivePageID();
  }

  getColumnDatesDic(){
    return this._viewService.getColumnDatesDic();
  }

  convertTimeToRow(time: Date){
    return this._timelineService.convertTimeToRow(time);
  }

  calcGridBasis(gridElement, gridSettings){
    return {x: gridElement.getBoundingClientRect().x, y: gridElement.offsetTop, height: gridElement.getBoundingClientRect().height/gridSettings.rows, width: gridElement.getBoundingClientRect().width/gridSettings.cols}
  }

  getAllEvents(){
    this.events = this._eventService.getAllEvents();
  }

  getEvents(date: Date, pageID: number){
    return this._eventService.getEvents(date, pageID);
  }

  getGridSettings() {
  	return this._gridService.getGridSettings();
  }

  createNewGrid(rows, cols){
  	let gridItems = [];
  	for (let row=0; row<rows; row++) {
  		gridItems[row] = [];
  		for (let col=0; col<cols; col++){
  			gridItems[row][col] = <GridItem>{row:row, col: col, selected: false, booked: false};
  		}
  	}
    return gridItems;
  }

  clearSelection(event) {
    this.clearSelectionEmitter.emit(event);
    delete this.selectionRowSpan;
    delete this.firstSelectedItem;
    for(let row=0; row<this.gridSettings.rows; row++){
      for(let col=0; col<this.gridSettings.cols; col++){
        this.gridItems[row][col].selected = false;
      }
    }
  }

  setSelection(selectionBox) {
    let gridBasis = this.gridBasis;
    if(this.step == 'step1') {
      gridBasis = this.gridBasisPrev;
    } else if(this.step == 'step2') {
      gridBasis = this.gridBasisNext;
    }
    const p1 = this.getGridMatrixIndices(gridBasis, {x: selectionBox.x, y: selectionBox.y});
    const p2 = this.getGridMatrixIndices(gridBasis, {x: selectionBox.x+selectionBox.width, y: selectionBox.y+selectionBox.height});
    if(this.firstSelectedItem){
      if(p1.row <= this.selectionBoundaries.min){
        p2.row>=this.selectionBoundaries.max ? this.selectionRowSpan = {start: this.selectionBoundaries.min, end: this.selectionBoundaries.max-1} : this.selectionRowSpan = {start: this.selectionBoundaries.min, end: p2.row};
      } else {
        p2.row>=this.selectionBoundaries.max ? this.selectionRowSpan = {start: p1.row, end: this.selectionBoundaries.max-1} : this.selectionRowSpan = {start: p1.row, end: p2.row};
      }
      for(let row=this.selectionBoundaries.min; row<this.selectionBoundaries.max; row++){
        if(row>=p1.row && row<=p2.row){
          this.gridItems[row][this.firstSelectedItem.col].selected = true;
        } else {
          this.gridItems[row][this.firstSelectedItem.col].selected = false;
        }
      }
    } else {
      for(let row=0; row<this.gridSettings.rows; row++){
        for(let col=0; col<this.gridSettings.cols; col++){
          if(!this.gridItems[row][col].booked){
            if(row>=p1.row && row<=p2.row && col>=p1.col && col<=p2.col){
              this.firstSelectedItem = this.gridItems[row][col];
              this.selectedDate = this.columnDatesDic[this.firstSelectedItem.col];
              this.setSelectionBoundaries();
              this.gridItems[row][col].selected = true;
            } else {
              this.gridItems[row][col].selected = false;
            }
          }
        }
      }
    }
  }

  setSelectionBoundaries(){
    let events = this.events;
    if(this.step =="step1"){
      events = this.prevPageEvents;
    } else if(this.step=="step2"){
      events = this.nextPageEvents;
    }
    const col = 0 ;
    this.selectionBoundaries = {min: 0, max: this.gridSettings.rows};
    if(this.firstSelectedItem){
      for(let event of events){
        const eventRowStart = this.convertTimeToRow(event.startDate);
        const eventRowEnd = this.convertTimeToRow(event.endDate);
        if(event.pageID == this.activePageID && event.startDate.getDate() == this.columnDatesDic[col].getDate() && event.startDate.getMonth() == this.columnDatesDic[col].getMonth() && event.startDate.getFullYear() == this.columnDatesDic[col].getFullYear()) {
          if(this.firstSelectedItem.row>=eventRowEnd && eventRowEnd>this.selectionBoundaries.min){
            this.selectionBoundaries.min = eventRowEnd;
          }
          if(this.firstSelectedItem.row<=eventRowStart && this.selectionBoundaries.max>eventRowStart){
            this.selectionBoundaries.max = eventRowStart;
          }
        }

      }
    }
  }

  getGridMatrixIndices(basis, point){
    return {row: Math.floor((point.y - basis.y)/basis.height), col: Math.floor((point.x - basis.x)/basis.width)}
  }

  setBookedItems(events){
    const col = 0;
    for(let row=0; row<this.gridSettings.rows; row++){
      this.gridItems[row][col].booked = false;
      for(let event of events){
        if(this.convertTimeToRow(event.startDate)<=row && row<this.convertTimeToRow(event.endDate) && event.pageID == this.activePageID && event.startDate.getDate() == this.columnDatesDic[col].getDate() && event.startDate.getMonth() == this.columnDatesDic[col].getMonth() && event.startDate.getFullYear() == this.columnDatesDic[col].getFullYear()){
          this.gridItems[row][col].booked = true;
        }
      }
    }
  }




}
