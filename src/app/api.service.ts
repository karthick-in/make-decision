import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Util } from './util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _registerUrl = "http://localhost:3000/register";
  private _loginUrl = "http://localhost:3000/login";
  private _verifyTokenUrl = "http://localhost:3000/verifyToken";

  constructor(
    private http: HttpClient,
    private util : Util
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }  

  // Use this function to find whether the current user is a verified token user...
  async isVerifiedLogin() {
    return await this.http.get(this._verifyTokenUrl).toPromise().then(
      success => console.log("Verified"),
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) { // unauthorized user
            console.log("Unauthorized user buddy!");
            this.util.logoutUser();
          }
        }
      }
    );
  }

}
