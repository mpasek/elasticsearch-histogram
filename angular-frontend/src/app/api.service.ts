import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  backendUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  public get(path) {
    var url = this.backendUrl + path;
    return this.http.get(url);
  }

}
