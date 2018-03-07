import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from './event'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient]
})
export class AppComponent {
  title = 'Streem Technical Test';
  events: Event[];
  backendUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {
    let url = this.backendUrl + 'events.json'
    this.http.get(url)
      .subscribe( (res:Event[]) => this.events = res);
  }
}
