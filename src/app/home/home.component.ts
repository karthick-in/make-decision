import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Util } from '../util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    public apiservice: ApiService,
    public util : Util) { }

  ngOnInit(): void {    
  }

  async verify_the_token(){
    await this.apiservice.isVerifiedLogin();    
  }

}
