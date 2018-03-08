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
  backendUrl: string = 'http://localhost:3000/';
  pageviews: Array<Pageview> = [];
  newUrl: string = '';
  urls: Array<string> = [];
  times: Array<any> = [];
  startStr: string;
  endStr: string;
  startTime: number;
  endTime: number;
  resInfo: any;
  

  constructor(private http: HttpClient) {
    this.addUrlDefaults();
    this.populateTimes();

    /* let url = this.backendUrl + 'page_views'
    this.http.get(url)
      .subscribe( (res:Pageview[]) => {
        console.log(res);
        this.pageviews = res;
      }); */
  }

  addUrlDefaults() {
    this.urls.push("http://www.news.com.au/travel/travel-updates/incidents/disruptive-passenger-grounds-flight-after-storming-cockpit/news-story/5949c1e9542df41fb89e6cdcdc16b615");
    this.urls.push("http://www.smh.com.au/sport/tennis/an-open-letter-from-martina-navratilova-to-margaret-court-arena-20170601-gwhuyx.html");
    this.urls.push("http://www.smh.com.au/nsw/premier-gladys-berejiklian-announces-housing-affordability-reforms-20170601-gwi0jn.html");
    this.urls.push("http://www.news.com.au/technology/environment/trump-pulls-us-out-of-paris-climate-agreement/news-story/f5c30a07c595a10a81d67611d0515a0a");
  }

  addUrl(): boolean {
    if(this.newUrl) {
      this.urls.push(this.newUrl);
    }
    this.newUrl = '';
    return false;
  }

  removeUrl(url): boolean {
    let index = this.urls.indexOf(url);
    this.urls.splice(index, 1);
    return false;
  }

  populateTimes() {
    var hours, minutes, ampm, time;
    for (var i = 0; i <= 1450; i += 60) {
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        time = hours.toString() + ':' + minutes.toString();
        this.times.push(time);
    }
  }

  setStart() {
    let element = document.getElementById("start") as HTMLSelectElement;
    this.startStr = element.options[ element.selectedIndex ].value;
  }

  setEnd() {
    let element = document.getElementById("end") as HTMLSelectElement;
    this.endStr = element.options[ element.selectedIndex ].value;
  }

  convertToMilli(time): number {
    let hour = time.substring(0,2);
    hour = parseInt(hour);
    console.log(hour);

    let date = new Date(2017, 5, 1, hour, 0, 0, 0);
    let dateInMil = date.getTime();
    return dateInMil;
  }

  generateHistogram() {
    console.log(this.urls);
    this.startTime = this.convertToMilli(this.startStr);
    this.endTime = this.convertToMilli(this.endStr);
    console.log(this.startTime);
    console.log(this.endTime);

    let interval = this.calculateInterval();

    this.getHistogramInfo(this.urls, this.startTime, this.endTime, interval)
      .subscribe( (res) => {
        console.log(res);
        this.resInfo = res;
      });
  }

  calculateInterval() {
    return "10m"
  }


  getHistogramInfo(urls: Array<string>, startTime: number, endTime: number, interval) {
    let url = this.backendUrl + 'page_views';
    let data = {
      "urls": urls,
      "startTime": startTime,
      "endTime": endTime,
      "interval": interval
    };
    let jsonData = {page_view: JSON.stringify(data)};
    return this.http.post(url, jsonData);
  }

}
