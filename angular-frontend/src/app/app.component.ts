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
    var utcDate = new Date(Date.UTC(2017, 5, 1, hour, 0, 0));
    console.log('utc date: ' + utcDate);
    let dateInMil = utcDate.getTime();
    return dateInMil;
  }

  generateHistogram() {
    this.validateTimeRange();

    this.startTime = this.convertToMilli(this.startNum);
    this.endTime = this.convertToMilli(this.endNum);
    console.log('start time in milli: ' + this.startTime);
    console.log('end time in milli: ' + this.endTime);

    this.calculateInterval(this.startNum, this.endNum);

    this.getHistogramInfo(this.urls, this.startTime, this.endTime, this.interval)
      .subscribe( (res) => {
        console.log(res);
        this.resInfo = res;
        //this.drawHistogram(this.resInfo);
        this.drawAggregatedBar(this.resInfo);
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
    console.log('interval: ' + this.interval);
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

  drawAggregatedBar(resInfo) {
    //let bucket1_1 = resInfo['aggregations']['time_bucket']['buckets'][0]['url_bucket']['buckets'];
    //console.log(bucket1_1);

    var url = [];

    let numUrls = this.urls.length;
    let buckets = resInfo['aggregations']['time_bucket']['buckets'];
    let bucketNames = [];
    let urlBucketCounts = [];
    console.log('number of buckets: ' + buckets.length);

    for(var i = 0; i < buckets.length; i++) {
      bucketNames.push(buckets[i]['key_as_string']);
    }

    for(var i=0; i < numUrls; i++) {
      urlBucketCounts[i] = new Array();
      urlBucketCounts[i]['counts'] = new Array();

      for(var j = 0; j < buckets.length; j++) {
        if(buckets[j].doc_count === 0) {
          urlBucketCounts[i]['counts'].push(0);
        } else {
          let obj = buckets[j]['url_bucket']['buckets'].find(x => x.key === this.urls[i]);
          let count;
          if(obj === undefined) {
            count = 0;
          } else {
            count = obj.doc_count;
          }
          urlBucketCounts[i]['counts'].push(count);
        }
      }

      
      
    }

    for (var i = 0; i < numUrls; i++) {
      url[i] = new Array();
      url[i]['x'] = bucketNames;
      url[i]['y'] = urlBucketCounts[i]['counts'];
      url[i]['name'] = this.urls[i];
      url[i]['type'] = 'bar';
      console.log(url[i]);

      
    }

    

    /* for(var j=0; j < this.urls.length; j++) {
      url[j+1] = {x: [], y: [], name: 'url'+j};
      url[j+1]['x'].push(name);
      console.log(url[j+1]);
      url[j+1]['y'].push(buckets[0]['url_bucket']['buckets']['doc_count']);
      url[j+1]['name'] = "url" + j;
    } */
    
    
    var url1 = {
      x: ['time1', 'time2', 'time3'],
      y: [20, 14, 23],
      name: 'url1',
      type: 'bar'
    };
    var url2 = {
      x: ['time1', 'time2', 'time3'],
      y: [20, 14, 23],
      name: 'url2',
      type: 'bar'
    };
    var url3 = {
      x: ['time1', 'time2', 'time3'],
      y: [20, 14, 23],
      name: 'url3',
      type: 'bar'
    };
    
    var data = [url[0], url[1], url[2]];
    
    var layout = {
      barmode: "stack",
      bargap: 0.05, 
      bargroupgap: 0.2,
      title: "Page Views", 
      xaxis: {title: "Time"}, 
      yaxis: {title: "Count"}
    };
    
    Plotly.newPlot('chart', data, layout);
  }


  drawHistogram(resInfo) {
    var arr = [];
    var url = [];
    var numBuckets = resInfo['aggregations']['time_bucket']['buckets'].length;

    console.log(numBuckets);

    for (var i = 0; i <= this.urls.length; i++) {
      arr[i+1] = new Array();
      for(var j=0; j< numBuckets; j++) {
        arr[i+1][j] = Math.random();
      }
    }

    for(var i=0; i <= this.urls.length; i++) {
      url[i+1] = new Object();
      url[i+1] = {
        x: arr[i+1],
        type: "histogram",
        name: "url" + i,
      }
    }

    var data = [url[1], url[2], url[3]];
    var layout = {
      barmode: "stack",
      bargap: 0.05, 
      bargroupgap: 0.2,
      title: "Page Views", 
      xaxis: {title: "Time"}, 
      yaxis: {title: "Count"}
    };
    Plotly.newPlot("chart", data, layout);

    /* var arr = [];
    var url = [];
    for (var i = 0; i <= this.urls.length; i++) {
      arr[i+1] = new Array();
      for(var j=0; j<100; j++) {
        arr[i+1][j] = Math.random();
      }
    }

    for(var i=0; i <= this.urls.length; i++) {
      url[i+1] = new Object();
      url[i+1] = {
        x: arr[i+1],
        type: "histogram",
        name: "url" + i,
      }
    }

    var data = [url[1], url[2], url[3]];
    var layout = {
      barmode: "stack",
      bargap: 0.05, 
      bargroupgap: 0.2,
      title: "Page Views", 
      xaxis: {title: "Time"}, 
      yaxis: {title: "Count"}
    };
    Plotly.newPlot("chart", data, layout);*/

    


  }

}
