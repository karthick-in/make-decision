import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { Util } from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MakeDecisionApp';

  constructor(public util : Util){

  }

}
