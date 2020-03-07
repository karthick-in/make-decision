import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _registerUrl = "http://localhost:3000/register";
  private _loginUrl = "http://localhost:3000/login";
  private _verifyTokenUrl = "http://localhost:3000/verifyToken";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  getToken() {
    let token = localStorage.getItem('token');
    return token;
  }

  loggedIn() : boolean{
    return !!localStorage.getItem('token');
  }

  // Use this function to find whether the current user is a verified token user...
  isVerifiedLogin(){
    this.verifyToken().subscribe(
      res => console.log("verified"),
      err => {
        if( err instanceof HttpErrorResponse ) {
          if (err.status === 401) { // unauthorized user
            this.logoutUser();     
          }
        }
      }
    )
  }

  verifyToken(){
    return this.http.get<any>(this._verifyTokenUrl);
  }
}
