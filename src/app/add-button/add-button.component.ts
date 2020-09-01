import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {

	@Output() addButtonEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }


  buttonClick(event){
  	this.addButtonEvent.emit();
  }
}
