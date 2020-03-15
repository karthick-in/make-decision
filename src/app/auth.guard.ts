import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Util } from './util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _apiservice : ApiService,
    private util : Util,
    private _router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if (this._apiservice.loggedIn()) {
        if(state.url.toString().includes('admin')){ // only admin users can have access here...
          if(this.util.isAdminRole()){
            return true;
          }
          else{
            console.log('Non-admin user trying to view admin page!');
            this._router.navigate(['/home']);
            return false;
          }
        }
        return true
      } else {
        console.log('Authguard failed')            
        this._router.navigate(['/login'])
        return false
      }
  }
  
}
