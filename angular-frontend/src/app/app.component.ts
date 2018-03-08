import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pageview } from './pageview';
import * as Plotly from 'plotly.js';
import {Config, Data, Layout} from 'plotly.js';

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
  startNum: number;
  endNum: number;
  startTime: number;
  endTime: number;
  interval: string;
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
    let startStr = element.options[ element.selectedIndex ].value;
    this.startNum = parseInt(startStr.substring(0,2));
  }

  setEnd() {
    let element = document.getElementById("end") as HTMLSelectElement;
    let endStr = element.options[ element.selectedIndex ].value;
    this.endNum = parseInt(endStr.substring(0,2));
  }

  convertToMilli(hour): number {
    let date = new Date(2017, 5, 1, hour, 0, 0, 0);
    console.log(date);
    let dateInMil = date.getTime();
    return dateInMil;
  }

  generateHistogram() {
    this.validateTimeRange();
    console.log(this.startNum);
    console.log(this.endNum);

    this.startTime = this.convertToMilli(this.startNum);
    this.endTime = this.convertToMilli(this.endNum);
    console.log(this.startTime);
    console.log(this.endTime);

    this.calculateInterval(this.startNum, this.endNum);

    this.getHistogramInfo(this.urls, this.startTime, this.endTime, this.interval)
      .subscribe( (res) => {
        console.log(res);
        this.resInfo = res;
        this.drawHistogram();
      });
  }

  validateTimeRange() {
    if(this.startNum <= this.endNum) {
      return;
    } else {
      let temp = this.startNum;
      this.startNum = this.endNum;
      this.endNum = temp;
    }
  }

  calculateInterval(start, end) {
    let diff = end - start;
    if(diff < 5) {
      this.interval = "10m";
    } else if(diff >= 5 && diff < 7) {
      this.interval = "15m";
    } else if(diff >= 7 && diff < 9) {
      this.interval = "20m";
    } else if(diff >= 9 && diff < 13) {
      this.interval = "30m";
    } else {
      this.interval = "1h"
    }
    console.log(this.interval);
  }

  getHistogramInfo(urls: Array<string>, startTime: number, endTime: number, interval: string) {
    let url = this.backendUrl + 'page_views';
    let data = {
      urls: urls,
      startTime: startTime,
      endTime: endTime,
      interval: interval
    };
    
    return this.http.post(url, {page_view: data});
  }



  drawHistogram() {
    var x1 = [];
    var x2 = [];
    for (var i = 0; i < 500; i ++) {
      x1[i] = Math.random();
      x2[i] = Math.random();
    }

    var trace1 = {
      x: x1,
      type: "histogram",
    };
    var trace2 = {
      x: x2,
      type: "histogram",
    };
    var data = [trace1, trace2];
    var layout = {
      barmode: "stack",
      bargap: 0.05, 
      bargroupgap: 0.2,
      title: "Sampled Results", 
      xaxis: {title: "Value"}, 
      yaxis: {title: "Count"}
    };
    Plotly.newPlot("chart", data, layout);

  }

}
