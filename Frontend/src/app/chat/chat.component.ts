import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpService } from '../http.service';
import { ChatModel } from '../models/chatModel.model';
import { UserModel } from '../models/userModel.model';
import { CredentialServiceService } from '../services/credential-service.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  allUsers: UserModel[];
  allChats: ChatModel[];
  chatWith: number[];
  chatUsers: UserModel[];
  selectedUser: number;
  messageText: string;
  selectedChats: ChatModel[];
  currentUser: UserModel;
  constructor(
    private _cred: CredentialServiceService,
    private _route: Router,
    private _http: HttpService,
    private _signalR: SignalRService
  ) {
  }

  ngOnInit(): void {
    this.allChats = [];
    this.chatWith = [];
    this.allUsers = [];
    this.selectedChats = [];
    this.selectedUser = 0;
    this.currentUser = this._cred.getCurrentUser();
    if (this.currentUser == undefined || this.currentUser == null) this._route.navigate(['/']); // Redirect if not logged in
    else {
      // Get all users from API
      this._http.getAllUsers().then(data => {
        this.allUsers = data;
        this.allUsers = this.allUsers.filter(u => u.id != this.currentUser.id); // Ignore myself
        this.getAllChats(); // Get all chats
      }).catch(err => {
        console.warn(err);
      });


      // Start SignalR connection
      this._signalR.startConnection();
      // Add listener to check for new messages
      this._signalR.addDataListener().on('getchats', (data) => {
        // Add new message to chat list
        this.allChats.push(data);
        // Update everything
        this.updateAll();
      });
    }
  }

  ngOnDestroy() {
    // Disconnect SignalR connection
    if (!(this.currentUser == undefined || this.currentUser == null))
      this._signalR.addDataListener().off('getchats');
  }

  updateAll() {
    this.getDistinctUsers(); // Get all indevidual users I have chats with
    this.selectUser(this.selectedUser); // Update selected user
  }

  getAllChats() {
    // Get all of my chats once
        this._http
          .getAllChats()
          .then((data: ChatModel[]) => {
            this.allChats = data;
            this.updateAll();
          })
          .catch((err) => {
            console.warn(err);
          });
  }

  logOutUser() {
    // logout user
    this._cred.logOutUser();
    // Disconnect SignalR connection
    this._signalR.destroyConnection();
    // Redirect to login page
    this._route.navigate(['/']);
  }

  getDistinctUsers() {
    // create a list of indevidual user ids that I have chat with
    this.allChats.forEach((c) => {
      if (!this.chatWith.includes(c.senderId)) this.chatWith.push(c.senderId);
      if (!this.chatWith.includes(c.receiverId))
        this.chatWith.push(c.receiverId);
    });
    this.chatWith = this.chatWith.filter((u) => u != this.currentUser.id); // Ignore me
    this.chatUsers = this.allUsers.filter((u) => this.chatWith.includes(u.id)); // Get the users with the ids
  }

  getUserChats(id: number) {
    // Get all chats with specific user
    return this.allChats.filter(c => c.receiverId == id || c.senderId == id);
  }

  getLastMessage(id: number): string {
    // Get last message of a specific user
    let chats = this.getUserChats(id);
    if (chats.length == 0)
      return '';
    return chats[chats.length - 1].message;
  }

  selectUser(id: number) {
    // Set current visible user
    this.selectedUser = id;
    this.selectedChats = this.getUserChats(id);
  }

  getSelectedName() {
    // Set the chat header
    if (this.selectedUser == 0)
      return 'Chats';
    let user = this.allUsers.find(u => u.id == this.selectedUser);
    return user.firstName + ' ' + user.lastName;
  }

  toTimeString(time: string) {
    // convert time to certain format
    let date = new Date(time);
    return [ date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ,
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ];
  }

  postMessage() {
    if (this.selectedUser != 0 && this.messageText.trim() != '') { // Send message only when there is any message and a user to send
      let chat = new ChatModel();
      chat.message = this.messageText;
      chat.receiverId = this.selectedUser;
      chat.senderId = this.currentUser.id;
      this._http.postNewMessage(chat); // Send message to API
      this.messageText = '';
    }
  }

  deleteChat(id: number) {
    // delete messages with a specific user
    if (id == 0) return;
    this._http.deleteChat(id).then(() => {
      Swal.fire({ // Show sweet alert
        title: 'Chats Deleted!',
        icon: 'info',
        timer: 1000,
        showConfirmButton: false
      });
      this.allChats = this.allChats.filter(c => c.receiverId != id && c.senderId != id); // remove the messages from list
      this.updateAll(); // Update Everything
    }).catch(err => {
      Swal.fire({
        title: 'Something went wrong!',
        text: err.message + '',
        timer: 1500,
        showConfirmButton: false,
        icon: 'error'
      });
    });
  }
}
