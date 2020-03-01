import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TokeninterceptorService {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    let apiservice = this.injector.get(ApiService)
    let tokenizedReq = req.clone(
      {
        headers: req.headers.set('Authorization', 'bearer ' + apiservice.getToken())
      }
    )
    return next.handle(tokenizedReq)
  }

}
