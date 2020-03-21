import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Util } from './util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly _registerUrl = "http://localhost:3000/register";
  private readonly _loginUrl = "http://localhost:3000/login";
  private readonly _verifyTokenUrl = "http://localhost:3000/verifyToken";
  private readonly _getQuestionsUrl = "http://localhost:3000/getQuestions";
  private readonly _answerTypeUrl = "http://localhost:3000/answertype";

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
  
  async getQuestions() {
    return await this.http.get(this._getQuestionsUrl).toPromise();
  }

  async getAnswerType() {
    return await this.http.get(this._answerTypeUrl).toPromise();
  }

  // Use this function to find whether the current user is a verified token user...
  async isVerifiedLogin() {
    return await this.http.get(this._verifyTokenUrl).toPromise().then(
      success => console.log("Verified"),
      err => {
        this.util.logoutIf401Error(err);      
       }
    );
  }

}
