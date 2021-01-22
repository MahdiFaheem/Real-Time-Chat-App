import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { UserModel } from '../models/userModel.model';
import { CredentialServiceService } from '../services/credential-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  emailAddress: string;
  submitted = false;
  noExistingUser = false;

  constructor(
    private _http: HttpService,
    private router: Router,
    private _cred: CredentialServiceService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this._cred.getCurrentUser() != null) {
      this.router.navigate(['/chats']);
    }
  }
  loginSubmitForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
      ],
    ],
  });
  get myForm() {
    return this.loginSubmitForm.controls;
  }

  keyPressLogin() {
    this.noExistingUser = false;
  }

  loginSubmit() {
    this.submitted = true;
    if (!this.loginSubmitForm.valid) {
      return false;
    }

    this._http.getLoginInfo(this.emailAddress).subscribe((data: UserModel) => {
      if (data) {
        console.log(data);
        this.noExistingUser = false;
        this._cred.loginUser(data);
        this.router.navigate(['/chats']);
      } else {
        this.noExistingUser = true;
      }
    });
  }
}
