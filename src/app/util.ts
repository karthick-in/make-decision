import * as CryptoJS from 'crypto-js';
import { User } from './user'

export class Util {

    errMsg = "";
    secretKey = "uierQsg";
    currentUser : any;
    currentToken : any;

    constructor() { }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string): string {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    resetValues(clearUser : User) : User{
        this.errMsg = "";
        clearUser = {} as User;
        this.currentUser = {};
        return clearUser;
    }    

    storeUser(newuser){                
        this.currentUser = newuser;
        this.currentToken = this.encrypt('token');
        localStorage.setItem(this.currentToken, newuser.user.token);
        console.log("Stored user value : "+this.currentUser)
    }

    removeUser(){
        this.currentUser = {};
        this.currentToken = null;
    }

    isAdminRole() : boolean{
        return (this?.currentUser?.user?.role_id === 1)
    }

    getSecuredToken(){
        return this.currentToken
    }   

}
