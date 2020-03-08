import * as CryptoJS from 'crypto-js';
import { User } from './user'

export class Util {

    errMsg = "";
    secretKey = "uierQsg";
    tokenStarter = "Q*Uuz";

    constructor() { }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string): string {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    resetValues(clearUser : User) : User{
        this.errMsg = "";
        return clearUser = {} as User;
    }    

    storeUser(newuser){ 
        localStorage.setItem(this.tokenStarter+this.encrypt('token'), newuser.user.token)
        //TODO: encrypt 'usr' string
        localStorage.setItem('usr',this.encrypt(JSON.stringify(newuser)));
    }

    retrieveUser(){
        return !!localStorage.getItem('usr') ? JSON.parse(this.decrypt(localStorage.getItem('usr'))) : null;
    }

    removeUser(){
        localStorage.clear();
    }

    isAdminRole() : boolean{
        var _usr = this.retrieveUser();
        return (_usr?.user?.role_id === 1)
    }

    getSecuredToken(){
        var values = Object.keys(localStorage).filter( (key)=> key.startsWith(this.tokenStarter)).map( (key)=> localStorage[key]);
        if(values[0] != null){
            var wholekeys = Object.keys(localStorage).filter( (key)=> key.startsWith(this.tokenStarter));
            return (this.decrypt(wholekeys[0]?.replace(this.tokenStarter, '')) == 'token') ? values[0] : false;
        }
        return false;        
    }   

}
