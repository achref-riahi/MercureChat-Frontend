import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  passwordFormGroup: FormGroup;

  submitted = false;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.passwordFormGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(4096),]],
      confirmPassword: ['', Validators.required]
      }, {
        validator: this.passwordmatchconfirm.bind(this)
    });

    this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        passwordFormGroup: this.passwordFormGroup
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  get fpassword() { return this.passwordFormGroup.controls; }

  passwordmatchconfirm(passwordFormGroup: FormGroup) {
      let password = passwordFormGroup.controls.password.value;
      let confirmPassword = passwordFormGroup.controls.confirmPassword.value;

      if (confirmPassword.length <= 0) {
          return null;
      }

      if (confirmPassword !== password) {
          return {
              doesMatchPassword: true
          };
      }
      return null;
  }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
      this.tryRegister();
  }

  tryRegister() {
    let registerParams = {email:this.registerForm.value.email,plainPassword:this.registerForm.value.passwordFormGroup.password};
    console.log(registerParams);
    this.userService.register(
      registerParams
    ).subscribe(
        response => {
          alert("Register Success");
          this.router.navigateByUrl('/login');
        },
        error => {
          alert("Register Error");
        });
  }

}
