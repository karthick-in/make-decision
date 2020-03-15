import { Component, OnInit } from '@angular/core';
import { Util } from '../util';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {

  constructor(
    public util : Util
  ) { }

  ngOnInit(): void {
  }

}
