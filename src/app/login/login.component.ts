import { Component, OnInit } from '@angular/core';
import { User } from '../user'
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Util } from '../util';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUser = new User;


  constructor(
    private apiservice: ApiService,
    private router: Router,
    public util: Util) { }

  ngOnInit(): void {
    this.util.errMsg = "";
  }

  login() {    
    this.loginUser.password = this.util.encrypt(this.loginUser.password)
    this.apiservice.loginUser(this.loginUser).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.router.navigate(['/home']);
    },
      err => {
        this.util.errMsg = "Invalid Input data";
      });
  }

}
