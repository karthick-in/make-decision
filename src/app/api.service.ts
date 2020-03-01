import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _registerUrl = "http://localhost:3000/register";
  private _loginUrl = "http://localhost:3000/login";

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
    //console.log("Here : " + token);
    return token;
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }
}
