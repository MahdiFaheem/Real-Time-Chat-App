import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { UserModel } from './models/userModel.model';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ChatModel } from './models/chatModel.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // API host and prefix
  apiHost: string = 'https://localhost:44360/api/';

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getLoginInfo(email: string) {
    // get a user by email
    return this.http.get(this.apiHost + 'users/' + email);
  }

  registerUser(user) {
    // register a user
    return this.http
      .post(this.apiHost+'users', user)
      .toPromise();
  }

  async getAllUsers(): Promise<any> {
    // get all users
    return await this.http.get(this.apiHost + 'users', {
      headers: this.getHeaders()
    }).toPromise();
  }

  postNewMessage(chat: ChatModel) {
    // send message to API
    return this.http.post(this.apiHost + 'chats', chat, {
      headers: this.getHeaders()
    }).toPromise();
  }

  getHeaders() {
    // generate authorization headers
    return {
      'Authorization': 'Basic ' + btoa(this.cookie.get('email') + ':'),
      'Content-Type': 'application/json'
    }
  }

  startChatSocketTunnel() {
    this.http.get(this.apiHost + 'chats', {
      headers: this.getHeaders()
    })
      .subscribe();
  }

  deleteChat(id: number) {
    // send delete request to API
    return this.http.delete(this.apiHost + 'chats/' + id, {
      headers: this.getHeaders()
    }).toPromise();
  }

  getAllChats() {
    // get all of my chats
    return this.http.get(this.apiHost + 'chats', {
      headers: this.getHeaders(),
    }).toPromise();
  }
}
