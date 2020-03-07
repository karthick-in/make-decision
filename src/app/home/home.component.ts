import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    public apiservice: ApiService) { }

  ngOnInit(): void {    
  }

  // TODO: remove this function
  verify_the_token(){
    this.apiservice.isVerifiedLogin();
    console.log("Hi youre a true user");
  }

}
