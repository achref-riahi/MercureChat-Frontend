import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient){}

  login(loginParams): Observable<any>{
    return this.http.post('http://localhost/api/login_check', loginParams);
  }

  register(registerParams): Observable<any>{
    return this.http.post('http://localhost/api/register', registerParams);
  }

}
