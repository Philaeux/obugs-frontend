import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Software} from "../models/software";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SoftwaresService {

  constructor(private http: HttpClient) { }

  pathSoftwareList = '/api/softwares/list'
  pathSoftwareDetails = '/api/softwares/details/'

  getSoftwareList() {
    return this.http.get<Software[]>(environment.apiUrl +  this.pathSoftwareList);
  }

  getSoftwareDetails(code: string) {
    return this.http.get<Software[]>(environment.apiUrl + this.pathSoftwareDetails + code);
  }
}
