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
      if(res.user.active.data[0] !== 1){  // to check if the user is active
        this.util.errMsg = "You're not an active user, please contact administrator!";
      }else{
        localStorage.clear();
        this.util.storeUser(res as User)        
        //this.util.setSecuredToken(res.user.token);
        this.router.navigate(['/home']);        
      }      
    },
      err => {
        this.util.errMsg = "Wrong Username or Password";
        this.loginUser.password = null;
      });
  }

}
