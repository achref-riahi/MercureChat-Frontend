import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(4096),]]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      this.tryLogin();
  }

  tryLogin() {
    this.userService.login(
      this.loginForm.value
    ).subscribe(
        response => {
          if (response.token) {
            localStorage.setItem("token", response.token);
            let payload = this.getDecodedAccessToken(response.token);
            localStorage.setItem("exp",payload.exp);
            localStorage.setItem("username", payload.username);
            this.router.navigateByUrl('/chat_room');
          }
        },
        error => {
          alert("Login Error");
        });
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
}
