import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ViewService } from '../view.service'

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  links = ['Platz 1', 'Platz 2', 'Platz 3', 'Platz 4'];
  activeLink = this.links[0];
  activePageID = 0;
  background: ThemePalette = undefined;
  color: ThemePalette = undefined;
  pagination: boolean = true;
  noRipple: boolean = false;
  @Output() navPageChange = new EventEmitter<number>();
  constructor(private _viewService: ViewService) { }

  ngOnInit(): void {
    this.setActivePageID(this.activePageID);
  }

  pageChange(pageID, pageName){
    this.activeLink = pageName;
    this.activePageID = pageID;
    this.setActivePageID(pageID);
    this.navPageChange.emit(pageID);
  }

  setActivePageID(pageID){
    this._viewService.setActivePageID(pageID);
  }

}
