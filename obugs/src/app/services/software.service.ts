import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SoftwareArrayPayload, SoftwarePayload, BugArrayPayload } from "../models/models";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {

  constructor(private http: HttpClient) { }

  pathSoftwareList = 'software/list'
  pathSoftwareDetails = 'software/details/'
  pathBugsList = 'software/bugs/'

  getSoftwareList() {
    return this.http.get<SoftwareArrayPayload>(`${environment.apiUrl}${this.pathSoftwareList}`);
  }

  getSoftwareDetails(softwareCode: string) {
    return this.http.get<SoftwarePayload>(`${environment.apiUrl}${this.pathSoftwareDetails}${softwareCode}`);
  }

  getBugs(softwareCode: string, status: string = "") {
    return this.http.get<BugArrayPayload>(`${environment.apiUrl}${this.pathBugsList}${softwareCode}?status=${status}`);
  }
}
