import { Injectable } from '@angular/core';
import { TimelineService } from './timeline.service'

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  links = ['Platz 1', 'Platz 2', 'Platz 3'];
	activePageID: number;
	columnDatesDic = <Date[]>[new Date()];
  constructor(private _timelineService: TimelineService) { }

  setActivePageID(pageID: number): void{
  	this.activePageID = pageID;
  }

  getActivePageName(){
    return this.links[this.activePageID];
  }


  getActivePageID(){
  	return this.activePageID;
  }

  setColumnDatesDic(datesDic){
    this.columnDatesDic = datesDic;
  }

  getColumnDatesDic(){
    return this.columnDatesDic;
  }

}
