import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pageview } from './pageview'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient]
})
export class AppComponent {
  title = 'Streem Technical Test';
  pageviews: Pageview[];
  backendUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {
    let url = this.backendUrl + 'page_views'
    this.http.get(url)
      .subscribe( (res:Pageview[]) => {
        console.log(res);
        this.pageviews = res;
      });
  }
}
