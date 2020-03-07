import * as CryptoJS from 'crypto-js';
import { User } from './user'

export class Util {

    errMsg = "";
    secretKey = "uierQsg";

    constructor() { }

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string): string {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    // TODO: remove this function
    resetValues(clearUser : User) : User{
        this.errMsg = "";
        clearUser = {} as User;
        return clearUser;
    }

}
