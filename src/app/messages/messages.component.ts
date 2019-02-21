import { Component, OnInit, Input } from '@angular/core';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: any[];
  @Input() message = { text:'' };
  container: HTMLElement;
  username: String;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.getMessages();
    this.messagesService.subscribe()
            .subscribe({
                next: (event) => {
                    console.log('observer: ' + event);
                    this.getMessages();
                }
            });

  }

  ngAfterViewChecked() {
    this.container = document.getElementById("card-body");
    this.container.scrollTop = this.container.scrollHeight;
  }

  getMessages() {
    this.messagesService.getMessages().subscribe((data) => {
      if (typeof data['hydra:member'] !== 'undefined' && data['hydra:member'].length > 0) {
        this.messages = data['hydra:member'];
      }
    });
  }

  tryPostMessage(){
    this.messagesService.postMessage(this.message).subscribe();
    this.message.text="";
  }

}
