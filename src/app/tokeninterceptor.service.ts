import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import { Util } from './util';

@Injectable({
  providedIn: 'root'
})
export class TokeninterceptorService {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    let util = this.injector.get(Util)
    let tokenizedReq = req.clone(
      {
        headers: req.headers.set('Authorization', 'bearer ' + util.getSecuredToken())
      }
    )
    return next.handle(tokenizedReq)
  }

}
