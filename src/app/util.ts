import * as CryptoJS from 'crypto-js';
import { User } from './user';
import { Router } from '@angular/router';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Util {

    errMsg = "";
    secretKey = "uierQsg";
    tokenStarter = "Q*Uuz";
    userDetailStarter = "O&#Ra!";

    constructor(
        private router: Router
        //private _changeDetect : ChangeDetectorRef
    ) { }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string): string {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    logoutUser() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    loggedIn(): boolean {
        return !!this.getSecuredToken();
    }

    resetValues(clearUser: any): any {
        this.errMsg = "";
        return clearUser = {} as any;
    }

    storeUser(newuser) {
        localStorage.setItem(this.tokenStarter + this.encrypt('token'), newuser.user.token)
        localStorage.setItem(this.userDetailStarter + this.encrypt('usr'), this.encrypt(JSON.stringify(newuser)));
    }

    retrieveUser() {
        try {
            var _getUsrValue = this.getSecuredValues(this.userDetailStarter, 'usr');
            //this._changeDetect.detectChanges();
            return !!_getUsrValue ? JSON.parse(this.decrypt(_getUsrValue)) : null
            
        } catch (error) {
            console.log("Err: " + error);
            this.logoutUser();                        
        }
        
    }

    isAdminRole(): boolean {
        var _usr = this.retrieveUser();
        return (_usr?.user?.role_id === 1)
    }

    getSecuredToken() {
        return this.getSecuredValues(this.tokenStarter, 'token');
    }

    getSecuredValues(_starter: any, _actualString: string): any {
        try {
            var values = Object.keys(localStorage).filter((key) => key.startsWith(_starter)).map((key) => localStorage[key]);
            if (values[0] != null) {
                var wholekeys = Object.keys(localStorage).filter((key) => key.startsWith(_starter));
                return (this.decrypt(wholekeys[0]?.replace(_starter, '')) == _actualString) ? values[0] : this.logoutUser();
            }
            return false;

        } catch (error) {
            console.log("Err : " + error);
            this.logoutUser();
        }

    }

    logoutIf401Error(err) {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) { // unauthorized user
                console.log("Unauthorized user buddy!");
                this.logoutUser();
            }
        }
    }

}
