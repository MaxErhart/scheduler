import { Injectable } from '@angular/core';
import { Event } from './event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {


	events = <Event[]>[];

  constructor() { }

  getAllEvents(){
  	return this.events;
  }

  getEvents(date: Date, pageID: number){
  	let tempEvents = [];
  	for(let event of this.events){
  		if(event.startDate.getDate() == date.getDate() && event.startDate.getMonth() == date.getMonth() && event.startDate.getFullYear() == date.getFullYear() && event.pageID == pageID && !event.weekly){
  			tempEvents.push(event)
  		} else if(event.weekly && event.pageID == pageID && event.startDate.getDay()==date.getDay()){
        tempEvents.push(event)
      }
  	}
  	return tempEvents;
  }

  addEvent(startDate: Date, endDate: Date, pageID: number, owner: string, title: string, description = <string>'', color: {background: string, text: string}, weekly: boolean){
    try {
      this.events.push({id: this.events[this.events.length-1].id +1, startDate: startDate, endDate: endDate, pageID: pageID, owner: owner, title: title, description: description, color: color, weekly: weekly});
    } catch (e) {
      this.events.push({id: 0, startDate: startDate, endDate: endDate, pageID: pageID, owner: owner, title: title, description: description, color: color, weekly: weekly});
    }

  }

  deleteEvent(eventID: number){
    for(let index=0; index<this.events.length; index++){
      if(this.events[index].id==eventID){
        this.events.splice(index, 1);
      }
    }
  }

}
