import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { UserModel } from '../models/userModel.model';
import { CredentialServiceService } from '../services/credential-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailAddress : string ="";
  firstName : string ="";
  lastName: string = "";
  user: UserModel;
  invalidEmail: boolean =true;
  invalidFirstName:boolean=true;
  invalidLastName:boolean=true;
  existingEmail: boolean=false;
  submitted: boolean=false;


  constructor(private  _http: HttpService, private _cred: CredentialServiceService, private _route: Router) { }

  ngOnInit(): void {
    if (this._cred.getCurrentUser() != null) {
      this._route.navigate(['/chats']);
    }
  }
   validateEmail() {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    this.existingEmail =false;
    if(this.emailAddress == "")
    {
      return this.invalidEmail =true;
    }
    else
    {
      if( emailReg.test(this.emailAddress ) )
      {
        return this.invalidEmail =false;
      }
      else
      {
        return this.invalidEmail =true;
      }
    }


  }




  validateFirstName()
  {
    if(this.firstName != ""){
      return this.invalidFirstName =false;
    }
    else
    {
      return this.invalidFirstName =true;
    }
  }

  validateLastName()
  {
    if(this.lastName != ""){
      return this.invalidLastName =false;
    }
    else
    {
      return this.invalidLastName =true;
    }
  }

  keyPressRegister(){
    this.validateEmail();
    this.validateFirstName();
    this.validateLastName();
  }


  registerSubmit() {
    this.submitted=true;
    this.keyPressRegister();

      if(!this.invalidEmail && !this.invalidFirstName && !this.invalidLastName)
      {

        this._http.registerUser({
              email: this.emailAddress,
              firstName: this.firstName,
              lastName: this.lastName
            }).then((data: UserModel) => {
              this._cred.loginUser(data);
              this._route.navigate(['/chats']);
            }).catch(err => {
              if(err.error?.Email?.length>0)
              this.existingEmail=true;
            })
      }

   }

}
