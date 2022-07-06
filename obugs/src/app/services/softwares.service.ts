import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Software} from "../models/software";

@Injectable({
  providedIn: 'root'
})
export class SoftwaresService {

  constructor(private http: HttpClient) { }

  listUrl = 'http://127.0.0.1:19999/api/software/list'

  listSoftware() {
    return this.http.get<Array<Software>>(this.listUrl);
  }
}
