import { Injectable } from '@angular/core';
import { SelectionBox } from './selectionBox.interface'

@Injectable({
  providedIn: 'root'
})
export class GridService {

	gridColumns = 1;
	gridRows = 48;
	gridBasis: {x: number, y: number, height: number, width: number};
  constructor() { }

  getGridSettings(){
  	return {rows: this.gridRows, cols: this.gridColumns}
  }

  setGridBasis(basis){
  	this.gridBasis = basis;
  }

  getGridBasis(){
  	return this.gridBasis;
  }

}
