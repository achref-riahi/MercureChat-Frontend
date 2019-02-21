import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(!localStorage.getItem('token')){
        this.router.navigate(['login']);
        return false;
      }

      let date = new Date();
      let timestamp = (date.getTime()/1000 | 0);
      if(parseInt(localStorage.getItem('exp')) < timestamp ){
        this.router.navigate(['login']);
        return false;
      }

      return true;
  }
}
