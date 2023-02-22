import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Software, SoftwareArrayPayload, SoftwarePayload } from "../models/software";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SoftwaresService {

  constructor(private http: HttpClient) { }

  pathSoftwareList = '/api/software/list'
  pathSoftwareDetails = '/api/software/details/'

  getSoftwareList() {
    return this.http.get<SoftwareArrayPayload>(environment.apiUrl + this.pathSoftwareList);
  }

  getSoftwareDetails(code: string) {
    return this.http.get<SoftwarePayload>(environment.apiUrl + this.pathSoftwareDetails + code + "/");
  }
}
