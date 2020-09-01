import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-event-info-form',
  templateUrl: './event-info-form.component.html',
  styleUrls: ['./event-info-form.component.scss']
})
export class EventInfoFormComponent implements OnInit {

	colors = {Grau: 'gray', Lila: '#6300ee', Grün: '#03dac4', Blau: '#58949C', Rot: '#F9665E', Pink: '#E18AAA'};
	@Input() onSecondStep = false;
	@Input() formGroup: FormGroup;
  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessage(input: FormControl){
    if(input.hasError('required')){
      return 'Benötigtes Feld'
    } else if(input.hasError('pattern')){
      return 'Nur Viertelstündige Uhrzeiten';
    }
  }

}
