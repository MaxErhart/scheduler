import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { SelectionBox } from '../selectionBox.interface'

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.scss']
})
export class SelectionBoxComponent implements OnInit {

	selectionBox: SelectionBox;
  @Output() selectionBoxUpdate = new EventEmitter<SelectionBox>();

  @HostListener('document:mousemove', ['$event']) documentMouseMove(event: MouseEvent) {
		if(this.selectionBox) {
      this.updateSelectionBox(event);
      this.selectionBoxUpdate.emit(this.selectionBox);
  	}
  }

  @HostListener('document:mouseup', ['$event']) documentMouseUp(event: MouseEvent) {
  	if(this.selectionBox) {
    	this.deleteSelectionBox();
  	}
  }


  constructor() { }

  ngOnInit(): void {
  }

  createSelectionBox(event): void {
  	if(event.buttons == 1 ){
	    event.preventDefault();
	    this.selectionBox = <SelectionBox>{x: event.pageX, y: event.pageY, width: 0, height: 0, x0: event.pageX, y0: event.pageY};
  	}
  }

  updateSelectionBox(event): void {
    event.preventDefault();
    const p1 = {x: event.pageX > this.selectionBox.x0 ? this.selectionBox.x0 : event.pageX,y: event.pageY > this.selectionBox.y0 ? this.selectionBox.y0 : event.pageY };
    const p2 = {x: event.pageX > this.selectionBox.x0 ? event.pageX : this.selectionBox.x0 ,y: event.pageY > this.selectionBox.y0 ? event.pageY : this.selectionBox.y0};
    this.selectionBox.x = p1.x;
    this.selectionBox.y = p1.y;
    this.selectionBox.width = p2.x - p1.x;
    this.selectionBox.height = p2.y - p1.y;
  }

  deleteSelectionBox(): void {
  	delete this.selectionBox;
  }
}
