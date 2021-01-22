import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../models/userModel.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialServiceService {

  constructor(private cookie: CookieService) { }

  loginUser(user: UserModel): void {
    this.cookie.set('userId', '' + user.id);
    this.cookie.set('email', user.email);
    this.cookie.set('firstName', user.firstName);
    this.cookie.set('lastName', user.lastName);
  }

  getCurrentUser(): UserModel {
    if (!this.cookie.check('userId'))
      return null;
    let user: UserModel = new UserModel(
      parseInt(this.cookie.get('userId')),
      this.cookie.get('email'),
      this.cookie.get('firstName'),
      this.cookie.get('lastName')
    );
    return user;
  }

  logOutUser() {
    this.cookie.deleteAll();
  }
}
