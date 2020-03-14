import * as CryptoJS from 'crypto-js';
import { User } from './user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
    ) { }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string): string {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    resetValues(clearUser: User): User {
        this.errMsg = "";
        return clearUser = {} as User;
    }

    storeUser(newuser) {
        localStorage.setItem(this.tokenStarter + this.encrypt('token'), newuser.user.token)
        localStorage.setItem(`${this.userDetailStarter}${this.encrypt('usr')}`, this.encrypt(JSON.stringify(newuser)));
    }

    retrieveUser() {
        var _getUsrValue = this.getSecuredValues(this.userDetailStarter, 'usr');
        return !!_getUsrValue ? JSON.parse(this.decrypt(_getUsrValue)) : null
    }

    removeUser() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    isAdminRole(): boolean {
        var _usr = this.retrieveUser();
        return (_usr?.user?.role_id === 1)
    }

    getSecuredToken() {
        try {
            var values = Object.keys(localStorage).filter((key) => key.startsWith(this.tokenStarter)).map((key) => localStorage[key]);
            if (values[0] != null) {
                var wholekeys = Object.keys(localStorage).filter((key) => key.startsWith(this.tokenStarter));
                return (this.decrypt(wholekeys[0]?.replace(this.tokenStarter, '')) == 'token') ? values[0] : false;
            }
            return false;

        } catch (error) {
            console.log("Err: " + error);
            this.removeUser();
        }

    }

    getSecuredValues(_starter: any, _actualString: string): any {
        try {
            var values = Object.keys(localStorage).filter((key) => key.startsWith(_starter)).map((key) => localStorage[key]);
            if (values[0] != null) {
                console.log('value :' + values[0]);

                var wholekeys = Object.keys(localStorage).filter((key) => key.startsWith(_starter));
                return (this.decrypt(wholekeys[0]?.replace(_starter, '')) == _actualString) ? values[0] : false;
            }
            return false;

        } catch (error) {
            console.log("Err : " + error);
            this.removeUser();
        }

    }

}
