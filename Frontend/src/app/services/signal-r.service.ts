import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpService } from '../http.service';
import { CredentialServiceService } from './credential-service.service';

@Injectable({
  providedIn: 'root',
})

  
export class SignalRService {
  private hubConntection!: signalR.HubConnection;

  constructor(private _cred: CredentialServiceService) {}

  public startConnection = () => {
    this.hubConntection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44360/chats?uid=${this._cred.getCurrentUser().id}`) // Send user id with url
      .build();

    // Establish hub connection
    this.hubConntection
      .start()
      .then(() => console.log('Connection Success'))
      .catch((err) => console.log('Error: ' + err));
  };

  public addDataListener = () => {
    return this.hubConntection;
  };

  public destroyConnection() {
    this.hubConntection.stop();
  }

}
